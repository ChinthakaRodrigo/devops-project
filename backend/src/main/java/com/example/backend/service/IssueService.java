package com.example.backend.service;

import com.example.backend.dto.IssueRequest;
import com.example.backend.dto.UpdateIssueStatusRequest;
import com.example.backend.model.Issue;
import com.example.backend.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    // CREATE ISSUE
    public String createIssue(IssueRequest request) {

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return "Title is required";
        }

        if (request.getDescription() == null || request.getDescription().isBlank()) {
            return "Description is required";
        }

        if (request.getCategory() == null || request.getCategory().isBlank()) {
            return "Category is required";
        }

        if (request.getLocation() == null || request.getLocation().isBlank()) {
            return "Location is required";
        }

        if (request.getCouncilName() == null || request.getCouncilName().isBlank()) {
            return "Council is required";
        }

        if (request.getCitizenId() == null) {
            return "Citizen ID is required";
        }

        Issue issue = new Issue();

        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setCategory(request.getCategory());
        issue.setLocation(request.getLocation());
        issue.setCitizenId(request.getCitizenId());
        issue.setCouncilName(request.getCouncilName());

        issue.setStatus("SUBMITTED");
        issue.setForwardedTo(null);

        issueRepository.save(issue);

        return "Issue created successfully";
    }


    // READ ALL ISSUES
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }


    // READ ONE ISSUE
    public Issue getIssueById(Integer id) {
        return issueRepository.findById(id);
    }


    // READ ISSUES BY COUNCIL
    public List<Issue> getIssuesByCouncil(String councilName) {
        return issueRepository.findByCouncilName(councilName);
    }


    // UPDATE ISSUE STATUS
    public String updateIssueStatus(
            Integer id,
            UpdateIssueStatusRequest request
    ) {

        String status = request.getStatus();

        if (status == null || status.isBlank()) {
            return "Status is required";
        }

        if (!status.equals("SUBMITTED") &&
                !status.equals("FORWARDED") &&
                !status.equals("IN_PROGRESS") &&
                !status.equals("RESOLVED")) {

            return "Invalid status";
        }

        int updatedRows = issueRepository.updateStatus(
                id,
                status,
                request.getForwardedTo()
        );

        if (updatedRows == 0) {
            return "Issue not found";
        }

        return "Issue updated successfully";
    }


    // DELETE ISSUE
    public String deleteIssue(Integer id) {

        int deletedRows = issueRepository.deleteById(id);

        if (deletedRows == 0) {
            return "Issue not found";
        }

        return "Issue deleted successfully";
    }
}