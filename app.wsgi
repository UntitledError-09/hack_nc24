server {
    listen 80;
    server_name gb.com;
    access_log  /var/log/nginx/example.log;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }