-- Verificar si la base de datos existe, si no, crearla
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'CompanySearchDB')
BEGIN
    CREATE DATABASE CompanySearchDB;
    PRINT 'Base de datos CompanySearchDB creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'Base de datos CompanySearchDB ya existe.';
END
GO

USE CompanySearchDB;
GO

-- Verificar si la tabla existe antes de crearla
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Companies' AND xtype='U')
BEGIN
    -- Crear tabla Companies 
    CREATE TABLE [dbo].[Companies] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Name] NVARCHAR(200) NOT NULL,
        [Addresses] NVARCHAR(MAX) NOT NULL DEFAULT '[]',
        [Countries] NVARCHAR(MAX) NOT NULL DEFAULT '[]',
        
        CONSTRAINT [PK_Companies] PRIMARY KEY CLUSTERED ([Id] ASC)
    );

    -- Crear índice para optimizar búsquedas por nombre
    CREATE NONCLUSTERED INDEX [IX_Companies_Name] ON [dbo].[Companies] ([Name]);
    
    PRINT 'Tabla Companies creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'Tabla Companies ya existe.';
END
GO

-- Verificar si hay datos, si no, insertar datos de prueba
IF (SELECT COUNT(*) FROM [dbo].[Companies]) = 0
BEGIN
    PRINT 'Insertando datos de prueba...';
    
    -- Script para insertar 100,000 registros de datos fake
    DECLARE @Counter INT = 1;
    DECLARE @BatchSize INT = 1000;
    DECLARE @TotalRecords INT = 100000;
    DECLARE @CompanyNames TABLE (Name NVARCHAR(100));

    INSERT INTO @CompanyNames VALUES 
    ('Tech Solutions'), ('Global Corp'), ('Innovation Hub'), ('Digital Works'), ('Smart Systems'),
    ('Future Tech'), ('Data Analytics'), ('Cloud Services'), ('AI Solutions'), ('Cyber Security'),
    ('Mobile Apps'), ('Web Development'), ('Software House'), ('IT Consulting'), ('Enterprise Solutions'),
    ('Business Intelligence'), ('Machine Learning'), ('Blockchain Tech'), ('IoT Systems'), ('Robotics Corp');

    DECLARE @Countries TABLE (Country NVARCHAR(50));
    INSERT INTO @Countries VALUES 
    ('Ecuador'), ('Colombia'), ('Peru'), ('Brasil'), ('Argentina'),
    ('Chile'), ('Mexico'), ('Estados Unidos'), ('Canada'), ('España');

    DECLARE @Cities TABLE (City NVARCHAR(50));
    INSERT INTO @Cities VALUES 
    ('Guayaquil'), ('Quito'), ('Cuenca'), ('Alborada'), ('Kennedy'),
    ('Urdesa'), ('Las Peñas'), ('Samanes'), ('Via a la Costa'), ('Ceibos'),
    ('Centro'), ('Norte'), ('Sur'), ('Mapasingue'), ('Garzota'),
    ('Sauces'), ('Entrerios'), ('Pascuales'), ('Duran'), ('Daule');

    WHILE @Counter <= @TotalRecords
    BEGIN
        INSERT INTO [dbo].[Companies] ([Name], [Addresses], [Countries])
        SELECT 
            (SELECT TOP 1 Name FROM @CompanyNames ORDER BY NEWID()) + ' ' + CAST((@Counter + t.number) AS VARCHAR(10)) AS Name,
            
            '[' +
            '"' + (SELECT TOP 1 City FROM @Cities ORDER BY NEWID()) + ' ' + CAST(ABS(CHECKSUM(NEWID())) % 9999 + 100 AS VARCHAR(10)) + '",' +
            '"' + (SELECT TOP 1 City FROM @Cities ORDER BY NEWID()) + ' ' + CAST(ABS(CHECKSUM(NEWID())) % 9999 + 100 AS VARCHAR(10)) + '",' +
            '"' + (SELECT TOP 1 City FROM @Cities ORDER BY NEWID()) + ' ' + CAST(ABS(CHECKSUM(NEWID())) % 9999 + 100 AS VARCHAR(10)) + '"' +
            ']' AS Addresses,
            
            '[' +
            '"' + (SELECT TOP 1 Country FROM @Countries ORDER BY NEWID()) + '",' +
            '"' + (SELECT TOP 1 Country FROM @Countries ORDER BY NEWID()) + '"' +
            ']' AS Countries
            
        FROM (
            SELECT TOP (@BatchSize) 
                ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 as number
            FROM sys.objects s1 CROSS JOIN sys.objects s2
        ) t
        WHERE @Counter + t.number <= @TotalRecords;
        
        SET @Counter = @Counter + @BatchSize;
        
        IF @Counter % 10000 = 0
        BEGIN
            PRINT 'Insertados ' + CAST(@Counter AS VARCHAR(10)) + ' registros...';
        END
    END;

    PRINT 'Datos de prueba insertados exitosamente.';
END
ELSE
BEGIN
    PRINT 'Ya existen datos en la tabla Companies.';
END
GO

-- Verificar resultados
SELECT COUNT(*) as TotalCompanies FROM [dbo].[Companies];
GO

PRINT 'Inicialización de base de datos completada.';