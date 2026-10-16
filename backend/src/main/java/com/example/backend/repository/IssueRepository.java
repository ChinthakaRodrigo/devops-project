package com.example.backend.repository;

import com.example.backend.model.Issue;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class IssueRepository {

    private final JdbcTemplate jdbcTemplate;

    public IssueRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(Issue issue) {

        String sql = """
                INSERT INTO issues
                (title, description, category, location, status,
                 citizen_id, council_name, forwarded_to)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                issue.getTitle(),
                issue.getDescription(),
                issue.getCategory(),
                issue.getLocation(),
                issue.getStatus(),
                issue.getCitizenId(),
                issue.getCouncilName(),
                issue.getForwardedTo()
        );
    }

    public List<Issue> findAll() {

        String sql = """
            SELECT id, title, description, category, location,
                   status, citizen_id, council_name, forwarded_to
            FROM issues
            ORDER BY id DESC
            """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    Issue issue = new Issue();

                    issue.setId(rs.getInt("id"));
                    issue.setTitle(rs.getString("title"));
                    issue.setDescription(rs.getString("description"));
                    issue.setCategory(rs.getString("category"));
                    issue.setLocation(rs.getString("location"));
                    issue.setStatus(rs.getString("status"));
                    issue.setCitizenId(rs.getInt("citizen_id"));
                    issue.setCouncilName(rs.getString("council_name"));
                    issue.setForwardedTo(rs.getString("forwarded_to"));

                    return issue;
                }
        );
    }

    public Issue findById(Integer id) {

        String sql = """
            SELECT id, title, description, category, location,
                   status, citizen_id, council_name, forwarded_to
            FROM issues
            WHERE id = ?
            """;

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {
                    Issue issue = new Issue();

                    issue.setId(rs.getInt("id"));
                    issue.setTitle(rs.getString("title"));
                    issue.setDescription(rs.getString("description"));
                    issue.setCategory(rs.getString("category"));
                    issue.setLocation(rs.getString("location"));
                    issue.setStatus(rs.getString("status"));
                    issue.setCitizenId(rs.getInt("citizen_id"));
                    issue.setCouncilName(rs.getString("council_name"));
                    issue.setForwardedTo(rs.getString("forwarded_to"));

                    return issue;
                },
                id
        );
    }

    public int updateStatus(Integer id, String status, String forwardedTo) {

        String sql = """
            UPDATE issues
            SET status = ?, forwarded_to = ?
            WHERE id = ?
            """;

        return jdbcTemplate.update(
                sql,
                status,
                forwardedTo,
                id
        );
    }

    public int deleteById(Integer id) {

        String sql = """
            DELETE FROM issues
            WHERE id = ?
            """;

        return jdbcTemplate.update(sql, id);
    }

    public List<Issue> findByCouncilName(String councilName) {

        String sql = """
        SELECT id, title, description, category, location,
               status, citizen_id, council_name, forwarded_to
        FROM issues
        WHERE council_name = ?
        ORDER BY id DESC
        """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    Issue issue = new Issue();

                    issue.setId(rs.getInt("id"));
                    issue.setTitle(rs.getString("title"));
                    issue.setDescription(rs.getString("description"));
                    issue.setCategory(rs.getString("category"));
                    issue.setLocation(rs.getString("location"));
                    issue.setStatus(rs.getString("status"));
                    issue.setCitizenId(rs.getInt("citizen_id"));
                    issue.setCouncilName(rs.getString("council_name"));
                    issue.setForwardedTo(rs.getString("forwarded_to"));

                    return issue;
                },
                councilName
        );
    }
}