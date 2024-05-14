# centos

yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx

echo "server {
    listen 80;
    server_name yiwrite.cn www.yiwrite.cn;

    # 默认请求将被提供index.html文件
    location / {
	proxy_pass https://xwchris.surge.sh:443/;
    }

    # 其他location块...
}" >> /etc/nginx/conf.d/main.conf

sudo systemctl reload nginx
