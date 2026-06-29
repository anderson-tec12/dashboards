import type { Container } from "./types";

export type TerminalEntry = {
  id: string;
  command: string;
  output: string;
};

export function runMockCommand(command: string, container: Container): string {
  const trimmed = command.trim();

  if (!trimmed) {
    return "";
  }

  if (container.status !== "running") {
    return "Error: container não está em execução";
  }

  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd) {
    case "ls":
      return "bin\netc\nhome\nlib\nopt\nroot\ntmp\nusr\nvar";
    case "pwd":
      return "/app";
    case "whoami":
      return "root";
    case "echo":
      return args.join(" ");
    case "cat": {
      const file = args[0];
      if (!file) {
        return "cat: missing file operand";
      }
      return `# mock content of ${file}\nversion=1.0.0\nname=${container.name}`;
    }
    case "ps":
      return "PID   USER     COMMAND\n  1   root     /bin/sh\n 42   root     node server.js";
    case "env":
      return `HOSTNAME=${container.name}\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nHOME=/root`;
    default:
      return `sh: ${cmd}: command not found`;
  }
}
