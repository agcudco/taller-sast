JUAN@DESKTOP-EJ04TB0 MINGW64 ~/taller-sast (taller-sast/jcgranda6)
$ semgrep scan

┌──── ○○○ ────┐
│ Semgrep CLI │
└─────────────┘

⠹ Loading rules from registry...                                                                                              
Scanning 115 files (only git-tracked) with:
                                      
✔ Semgrep OSS
  ✔ Basic security coverage for first-party code vulnerabilities.
                                              
✔ Semgrep Code (SAST)
  ✔ Find and fix vulnerabilities in the code you write with advanced scanning and expert security rules.
                                                     
✘ Semgrep Supply Chain (SCA)
  ✘ Find and fix the reachable vulnerabilities in your OSS dependencies.
 
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% 0:00:01                                                                                                                        
                    
                    
┌──────────────────┐
│ 14 Code Findings │
└──────────────────┘
                                                                  
    apps\analisis-vulnerabilidades\backend\index.js
     ❱ javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
          ❰❰ Blocking ❱❱
          A CSRF middleware was not detected in your express application. Ensure you are either using one such
          as `csurf` or `csrf` (see rule references) and/or you are properly doing CSRF validation in your    
          routes with a token or cookies.                                                                     
          Details: https://sg.run/BxzR                                                                        
                                                                                                              
            7┆ const app = express();
   
     ❱ javascript.express.log.console-log-express.console-log-express
          ❰❰ Blocking ❱❱
          Detected a logger that logs user input without properly neutralizing the output. The log message  
          could contain characters like ` ` and ` ` and cause an attacker to forge log entries or include   
          malicious content into the logs. Use proper input validation and/or output encoding to prevent log
          entries from being forged.                                                                        
          Details: https://sg.run/pK7Ok                                                                     
                                                                                                            
           53┆ console.log('[SQLi Categories]', query);
   
   ❯❯❯❱ javascript.express.express-sqlite-sqli.express-sqlite-sqli
          ❰❰ Blocking ❱❱
          Untrusted input might be used to build a database query, which can lead to a SQL injection         
          vulnerability. An attacker can execute malicious SQL statements and gain unauthorized access to    
          sensitive data, modify, delete data, or execute arbitrary system commands. To prevent this         
          vulnerability, use prepared statements that do not concatenate user-controllable strings and use   
          parameterized queries where SQL commands and user data are strictly separated. Also, consider using
          an object-relational (ORM) framework to operate with safer abstractions.                           
          Details: https://sg.run/76lG                                                                       
                                                                                                             
           54┆ db.all(query, (err, rows) => {
   
     ❱ javascript.express.log.console-log-express.console-log-express
          ❰❰ Blocking ❱❱
          Detected a logger that logs user input without properly neutralizing the output. The log message  
          could contain characters like ` ` and ` ` and cause an attacker to forge log entries or include   
          malicious content into the logs. Use proper input validation and/or output encoding to prevent log
          entries from being forged.                                                                        
          Details: https://sg.run/pK7Ok                                                                     
                                                                                                            
          101┆ console.log('[SQLi Products]', query);
   
   ❯❯❯❱ javascript.express.express-sqlite-sqli.express-sqlite-sqli
          ❰❰ Blocking ❱❱
          Untrusted input might be used to build a database query, which can lead to a SQL injection         
          vulnerability. An attacker can execute malicious SQL statements and gain unauthorized access to    
          sensitive data, modify, delete data, or execute arbitrary system commands. To prevent this         
          vulnerability, use prepared statements that do not concatenate user-controllable strings and use   
          parameterized queries where SQL commands and user data are strictly separated. Also, consider using
          an object-relational (ORM) framework to operate with safer abstractions.                           
          Details: https://sg.run/76lG                                                                       
                                                                                                             
          102┆ db.all(query, (err, rows) => {
   
   ❯❯❯❱ javascript.express.express-child-process.express-child-process
          ❰❰ Blocking ❱❱
          Untrusted input might be injected into a command executed by the application, which can lead to a   
          command injection vulnerability. An attacker can execute arbitrary commands, potentially gaining    
          complete control of the system. To prevent this vulnerability, avoid executing OS commands with user
          input. If this is unavoidable, validate and sanitize the user input, and use safe methods for       
          executing the commands. For more information, see [Command injection prevention for JavaScript ]    
          (https://semgrep.dev/docs/cheat-sheets/javascript-command-injection/).                              
          Details: https://sg.run/9p1R                                                                        
                                                                                                              
          154┆ exec(cmd, (error, stdout, stderr) => {
   
   ❯❯❱ javascript.lang.security.detect-child-process.detect-child-process
          ❰❰ Blocking ❱❱
          Detected calls to child_process from a function argument `req`. This could lead to a command  
          injection if the input is user controllable. Try to avoid calls to child_process, and if it is
          needed ensure user input is correctly sanitized or sandboxed.                                 
          Details: https://sg.run/l2lo                                                                  
                                                                                                        
          154┆ exec(cmd, (error, stdout, stderr) => {
                                                                     
    apps\analisis-vulnerabilidades\frontend\index.html
    ❯❱ html.security.audit.missing-integrity.missing-integrity
          ❰❰ Blocking ❱❱
          This tag is missing an 'integrity' subresource integrity attribute. The 'integrity' attribute allows
          for the browser to verify that externally hosted files (for example from a CDN) are delivered       
          without unexpected manipulation. Without this attribute, if an attacker can modify the externally   
          hosted resource, this could lead to XSS and other types of attacks. To prevent this, include the    
          base64-encoded cryptographic hash of the resource (file) you’re telling the browser to fetch in the 
          'integrity' attribute for all externally hosted files.                                              
          Details: https://sg.run/krXA                                                                        
                                                                                                              
            8┆ <link                                                                                
               href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
               rel="stylesheet">                                                                    
            ⋮┆----------------------------------------
          100┆ <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-
               alpha1/dist/js/bootstrap.bundle.min.js"></script>         
                                               
    apps\auth-service\Dockerfile
   ❯❯❱ dockerfile.security.missing-user.missing-user
          ❰❰ Blocking ❱❱
          By not specifying a USER, a program in the container may run as 'root'. This is a security hazard.
          If an attacker can control a process running as root, they may have control over the container.   
          Ensure that the last USER in a Dockerfile is a USER other than 'root'.                            
          Details: https://sg.run/Gbvn                                                                      
                                                                                                            
           ▶▶┆ Autofix ▶ USER non-root CMD ["node", "dist/main"]
           25┆ CMD ["node", "dist/main"]
                                           
    apps\frontend\Dockerfile
   ❯❯❱ dockerfile.security.missing-user.missing-user
          ❰❰ Blocking ❱❱
          By not specifying a USER, a program in the container may run as 'root'. This is a security hazard.
          If an attacker can control a process running as root, they may have control over the container.   
          Ensure that the last USER in a Dockerfile is a USER other than 'root'.                            
          Details: https://sg.run/Gbvn                                                                      
                                                                                                            
           ▶▶┆ Autofix ▶ USER non-root CMD ["nginx", "-g", "daemon off;"]
           24┆ CMD ["nginx", "-g", "daemon off;"]
                                           
    apps\frontend\nginx.conf
    ❯❱ generic.nginx.security.possible-h2c-smuggling.possible-nginx-h2c-smuggling
          ❰❰ Blocking ❱❱
          Conditions for Nginx H2C smuggling identified. H2C smuggling allows upgrading HTTP/1.1 connections 
          to lesser-known HTTP/2 over cleartext (h2c) connections which can allow a bypass of reverse proxy  
          access controls, and lead to long-lived, unrestricted HTTP traffic directly to back-end servers. To
          mitigate: WebSocket support required: Allow only the value websocket for HTTP/1.1 upgrade headers  
          (e.g., Upgrade: websocket). WebSocket support not required: Do not forward Upgrade headers.        
          Details: https://sg.run/ploZ                                                                       
                                                                                                             
           16┆ proxy_http_version 1.1;
           17┆ proxy_set_header Upgrade $http_upgrade;
           18┆ proxy_set_header Connection 'upgrade';
            ⋮┆----------------------------------------
           25┆ proxy_http_version 1.1;
           26┆ proxy_set_header Upgrade $http_upgrade;
           27┆ proxy_set_header Connection 'upgrade';
                                           
    apps\products\Dockerfile
   ❯❯❱ dockerfile.security.missing-user.missing-user
          ❰❰ Blocking ❱❱
          By not specifying a USER, a program in the container may run as 'root'. This is a security hazard.
          If an attacker can control a process running as root, they may have control over the container.   
          Ensure that the last USER in a Dockerfile is a USER other than 'root'.                            
          Details: https://sg.run/Gbvn                                                                      
                                                                                                            
           ▶▶┆ Autofix ▶ USER non-root CMD ["node", "dist/main"]
           24┆ CMD ["node", "dist/main"]

                
                
┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
 • Findings: 14 (14 blocking)
 • Rules run: 442
 • Targets scanned: 115
 • Parsed lines: ~100.0%
 • Scan skipped: 
   ◦ Files matching .semgrepignore patterns: 4
 • Scan was limited to files tracked by git
 • For a detailed list of skipped files and lines, run semgrep with the --verbose flag
Ran 442 rules on 115 files: 14 findings.

JUAN@DESKTOP-EJ04TB0 MINGW64 ~/taller-sast (taller-sast/jcgranda6)