package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SchemaInitializationTest {

    @Test
    void schemaScriptCreatesAuthAndIssueTables() throws SQLException {
        ClassPathResource resource = new ClassPathResource("schema.sql");
        assertTrue(resource.exists(), "schema.sql should be present so the users and issues tables are created on startup");

        DataSource dataSource = new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .build();

        assertDoesNotThrow(() -> ScriptUtils.executeSqlScript(dataSource.getConnection(), resource));

        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        Boolean usersExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'USERS'",
                Boolean.class
        );
        Boolean issuesExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ISSUES'",
                Boolean.class
        );

        assertTrue(Boolean.TRUE.equals(usersExists));
        assertTrue(Boolean.TRUE.equals(issuesExists));
    }
}
