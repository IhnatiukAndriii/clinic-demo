import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

interface Frame {
  file: string;
  seconds: number;
}

const PAUSE_SECONDS = 1.8;

function concatPath(file: string): string {
  return file.replace(/\\/g, "/");
}

/** Collects screenshots during a run and encodes them to a GIF with ffmpeg. */
export class FrameRecorder {
  private readonly frames: Frame[] = [];
  private readonly dir: string;

  constructor(private readonly page: Page, dir: string) {
    this.dir = path.resolve(dir);
    rmSync(this.dir, { recursive: true, force: true });
    mkdirSync(this.dir, { recursive: true });
  }

  async capture(seconds: number): Promise<void> {
    const file = path.join(this.dir, `frame-${String(this.frames.length).padStart(3, "0")}.png`);
    await this.page.screenshot({ path: file });
    this.frames.push({ file, seconds });
  }

  /** Holds the current view long enough to read, before or after a step. */
  pause(): Promise<void> {
    return this.capture(PAUSE_SECONDS);
  }

  encode(output: string): void {
    if (this.frames.length === 0) return;
    const last = this.frames[this.frames.length - 1];
    const entries = this.frames.map((frame) => `file '${concatPath(frame.file)}'\nduration ${frame.seconds}`);
    const listFile = path.join(this.dir, "frames.txt");
    writeFileSync(listFile, [...entries, `file '${concatPath(last.file)}'`].join("\n"));
    const filter = "fps=10,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse";
    execFileSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-vf", filter, path.resolve(output)]);
  }
}
