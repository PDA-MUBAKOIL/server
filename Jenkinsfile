void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/PDA-MUBAKOIL/server.git"],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

def EXPRESS_IMAGE_ID = ''

pipeline {
  agent any
	post {
    failure {
      setBuildStatus("Build failed", "FAILURE");
    }
    success {
      setBuildStatus("Build succeeded", "SUCCESS");
    }
  }
  stages {
    stage('init') {
        steps {
            echo 'init pipeline, check changes'
            setBuildStatus("Pending", "PENDING")
        }
    }
    stage('cofing') {
      steps {
        echo 'copy configuration files'
        sh 'pwd'
        
        sh 'cp /var/jenkins_home/workspace/config/.env.express .env'
      }
    }
    stage('build-express') {
      steps {
        script {
          EXPRESS_IMAGE_ID = sh(returnStdout: true, script: 'docker images | grep express | awk \'{print $3\'}').trim()
          echo "prev image id : ${EXPRESS_IMAGE_ID}"
        }
        echo 'move directory'
        sh 'pwd'
        sh 'docker build -t express .'
      }
    }
    stage('down') {
      environment {
        EXPRESS_CONTAINER_ID = sh(returnStdout: true, script: 'docker ps -a | grep express-prod | awk \'{print $1\'}').trim()
      }
      steps {
        script {
          if(env.EXPRESS_CONTAINER_ID != null) {
            echo 'stop react container'
            echo "${env.EXPRESS_CONTAINER_ID}"
            sh "docker stop ${env.EXPRESS_CONTAINER_ID}"
            echo 'remove docker container'
            sh "docker rm ${env.EXPRESS_CONTAINER_ID}"
          }
        }
      }
    }
    stage('deploy') {
      steps {
        echo 'run docker container'
        sh 'docker run --name express-prod -d -p 8080:3001 --restart=on-failure --network=mubakoil-prod express'
      }
    }
    stage('clean') {
      steps {
        echo "Clean express image ${EXPRESS_IMAGE_ID}"
        sh "docker rmi ${EXPRESS_IMAGE_ID}"
        // dangling images for multi stage build
        sh "docker image prune --force"
      }
    }
  }
}
