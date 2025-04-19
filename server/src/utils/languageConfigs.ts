export interface LanguageConfig {
  fileName: string;
  dockerImage: string;
  runCommand: string;
}

export const languageConfigs: Record<string, LanguageConfig> = {
  node: {
    fileName: 'program.js',
    dockerImage: 'code-runner-node',
    runCommand: 'node program.js',
  },
  python: {
    fileName: 'program.py',
    dockerImage: 'code-runner-python',
    runCommand: 'python program.py',
  },
  cpp: {
    fileName: 'program.cpp',
    dockerImage: 'code-runner-cpp',
    runCommand: 'g++ program.cpp -o program && ./program',
  },
  c: {
    fileName: 'program.c',
    dockerImage: 'code-runner-c',
    runCommand: './program',
  },
  java: {
    fileName: 'Program.java',
    dockerImage: 'code-runner-java',
    runCommand: 'javac Program.java && java Program',
  },
  go: {
    fileName: 'program.go',
    dockerImage: 'code-runner-go',
    runCommand: 'go run program.go',
  },
  rust: {
    fileName: 'program.rs',
    dockerImage: 'code-runner-rust',
    runCommand: './program',
  },
  ruby: {
    fileName: 'program.rb',
    dockerImage: 'code-runner-ruby',
    runCommand: 'ruby program.rb',
  },
  php: {
    fileName: 'program.php',
    dockerImage: 'code-runner-php',
    runCommand: 'php program.php',
  },
  bash: {
    fileName: 'program.sh',
    dockerImage: 'code-runner-bash',
    runCommand: 'bash program.sh',
  },
  ts: {
    fileName: 'program.ts',
    dockerImage: 'code-runner-ts',
    runCommand: 'ts-node program.ts',
  },
  kotlin: {
    fileName: 'Program.kt',
    dockerImage: 'code-runner-kotlin',
    runCommand:
      'kotlinc Program.kt -include-runtime -d program.jar && java -jar program.jar',
  },
  swift: {
    fileName: 'program.swift',
    dockerImage: 'code-runner-swift',
    runCommand: 'swift program.swift',
  },
};
