#define base docker image
FROM openjdk:17
LABEL Maintainer="YassineBibi"

# Copy the JAR file into the container
COPY target/Cyberkraftwerk2-0.0.1-SNAPSHOT.jar /app/cyberkraftwerk2.jar

# Set the working directory
WORKDIR /app

# Specify the command to run on container start
ENTRYPOINT ["java", "-jar", "cyberkraftwerk2.jar"]

#Exposing the port
EXPOSE 8080