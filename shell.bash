#!/bin/bash
appname="sum12factor"
port=8080

run() {
    echo "docker run \
        -e DOCKER_INSTANCE=$instance \
        -e DOCKER_PORT=$port \
        --name=$appname$instance \
        -p $port:8080 \
        -d \
        --restart=unless-stopped $appname"
}

stopmultiple() {
    docker ps | grep $appname | awk 'FNR > 0 {print $1}' | xargs docker rm -f
}

if [ $1 == "local" ]
  then

    if [ $2 == "deploy" ]
      then
        port=8080
        instance=1
        docker build -t $appname .
        stopmultiple
        eval $(run)
    fi

    if [ $2 == "multiple" ]
      then
        docker build -t $appname .
        for n in $(seq "$3")
        do
            port=$(($port+1))
            instance=$n
            eval $(run)
        done
    fi

    if [ $2 == "stopmultiple" ]
      then
        stopmultiple
    fi

    if [ $2 == "stop" ]
      then
        docker stop $3
    fi

    if [ $2 == "exec" ]
      then
        docker exec -it $3 $4
    fi

    if [ $2 == "start" ]
      then
        docker start $3
    fi

    if [ $2 == "logs" ]
      then
        docker logs -f $3
    fi
fi