void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/PDA-MUBAKOIL/server.git"],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

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
        dir('../config') {
          sh 'cp .env-express ../server/.env'
        }
        sh 'pwd'
      }
    }
    stage('build-express') {
      steps {
        echo 'move directory'
        sh 'pwd'
        sh 'docker build -t express .'
      }
    }
    stage('down') {
      environment {
        EXPRESS_CONTAINER_ID = sh(returnStdout: true, script: 'docker ps -a | grep express | awk \'{print $1\'}').trim()
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
        sh 'docker run --name express -d -p 8080:3001 express'
      }
    }
  }
}
