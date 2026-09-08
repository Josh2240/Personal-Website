// scripts/cleanup-ports.js
// Kills processes on ports 3000 and 3001 to prevent EADDRINUSE errors
const { execSync } = require('child_process')

function killPort(port) {
  try {
    const output = execSync(`cmd /c netstat -ano | findstr :${port} | findstr LISTENING`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const lines = output.trim().split('\n')
    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      const pid = parts[parts.length - 1]
      if (pid) {
        try {
          execSync(`cmd /c taskkill /F /PID ${pid}`, { stdio: 'ignore' })
          console.log(`Killed process ${pid} on port ${port}`)
        } catch {
          // Process may have already exited
        }
      }
    }
  } catch {
    // No process found on port
  }
}

killPort(3000)
killPort(3001)
