docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=T@st1234" -p 1433:1433 --name ua-sql-server -d mcr.microsoft.com/mssql/server:2022-latest
