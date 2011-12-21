require 'rubygems'
require 'httparty'
require 'json'

class GithubClient
  include HTTParty
  base_uri "https://api.github.com/repos"
  # debug_output $stdout
  headers "Content-Type" => "application/vnd.github-issue.raw+json"
  basic_auth ENV['GITHUB_USER'], ENV['GITHUB_PWD'] unless ENV['GITHUB_USER'].nil?

  def self.each_issue(params=nil)
    params = ('&' + params) if params
    page = 1
    begin
      issues = get("/#{ENV['GITHUB_PROJECT']}/issues?page=#{page}#{params}")
      raise RuntimeError, "Unexpected response: #{issues}" unless issues.response.code == '200'
      issues.each do |issue|
        yield issue
      end
      page += 1
    end while issues.size > 0
  end

  def self.issues(filter=nil)
    params = "labels=#{filter}" unless filter.nil?
    issues = []
    each_issue(params) do |issue|
      issues << issue
    end
    issues
  end
end