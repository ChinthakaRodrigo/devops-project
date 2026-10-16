package com.example.backend.controller;

import com.example.backend.dto.IssueRequest;
import com.example.backend.dto.UpdateIssueStatusRequest;
import com.example.backend.model.Issue;
import com.example.backend.service.IssueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    public String createIssue(@RequestBody IssueRequest request) {
        return issueService.createIssue(request);
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Integer id) {
        return issueService.getIssueById(id);
    }

    @PutMapping("/{id}/status")
    public String updateIssueStatus(
            @PathVariable Integer id,
            @RequestBody UpdateIssueStatusRequest request
    ) {
        return issueService.updateIssueStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable Integer id) {
        return issueService.deleteIssue(id);
    }

    @GetMapping("/council/{councilName}")
    public List<Issue> getIssuesByCouncil(
            @PathVariable String councilName
    ) {
        return issueService.getIssuesByCouncil(councilName);
    }

}