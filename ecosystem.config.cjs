module.exports = {
    apps: [
      {
        name: "application-fe",
        script: "npm",
        args: "start",
        exec_mode: "fork",
        instances: 1,                    // K8s handles scaling
        autorestart: true,
        // max_memory_restart: "512M",      // Optional: auto-restart if memory spikes
        merge_logs: true,                // Combine stdout/stderr into Docker logs
        out_file: "/dev/stdout",         // Send access logs to stdout
        error_file: "/dev/stderr",       // Send error logs to stderr
        log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };