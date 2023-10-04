# Use the official Microsoft SQL Server image as a base
FROM mcr.microsoft.com/mssql/server:2022-latest

# Copy your script into the image
COPY ./User.sql .

RUN sqlcmd -i User.sql
