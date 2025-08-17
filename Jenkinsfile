pipeline{
    agent any
    triggers { 
        githubPush()  // Trigger when code is pushed to GitHub 
    } 

        environment { 
        EC2_IP = '54.172.96.229'                  // Replace with EC2 Public IP 
        SSH_CRED = 'ssh-key'           // Jenkins SSH credentials ID 
        FRONTEND_REPO = 'git@github.com:sanjay-singh-panwar/E-Commerce-UI.git'  // Your GitHub repo 
        FRONTEND_DIR = '/home/ubuntu/project'     // Folder on EC2 
    } 
   stages {        
       stage('Checkout') { 
            steps { 
                echo 'Trigger received. Starting frontend deployment pipeline...' 
            } 
        } 
        stage('Deploy Frontend to EC2') { 
            steps { 
                sshagent (credentials: ["${SSH_CRED}"]) { 
                    sh """ 
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} ' 
                            # Remove old files           
                            rm -rf ${FRONTEND_DIR} && 
                            # Clone latest code 
                            git clone ${FRONTEND_REPO} ${FRONTEND_DIR} && 
                            # Build frontend     
                            cd ${FRONTEND_DIR} &&
                            npm install &&
                            npm run build 
                             # Deploy build output to Nginx web root
                            sudo rm -rf /var/www/html/* &&
                            sudo cp -r ${FRONTEND_DIR}/build/* /var/www/html/
                        ' 
                    """ 
                } 
            } 
        } 
 
        stage('Restart Frontend Service') { 
            steps { 
                sshagent (credentials: ["${SSH_CRED}"]) { 
                    sh """ 
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '                             # Example: Restart nginx to serve new build                     
                        sudo systemctl restart nginx 
                        ' 
                    """ 
                } 
            } 
        } 
    } 

}

