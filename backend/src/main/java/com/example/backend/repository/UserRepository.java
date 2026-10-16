package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(User user) {

        String sql = """
                INSERT INTO users
                (name, email, password, role, council_name)
                VALUES (?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getCouncilName()
        );
    }

    public User findByEmail(String email) {

        String sql = """
            SELECT id, name, email, password, role, council_name
            FROM users
            WHERE email = ?
            """;

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {
                    User user = new User();

                    user.setId(rs.getInt("id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password"));
                    user.setRole(rs.getString("role"));
                    user.setCouncilName(rs.getString("council_name"));

                    return user;
                },
                email
        );
    }
    public boolean existsByEmail(String email) {

        String sql = """
            SELECT COUNT(*)
            FROM users
            WHERE email = ?
            """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                email
        );

        return count != null && count > 0;
    }
}