interface UserSchema extends Record<string, unknown> {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
    created_at?: string;
}

interface CondensedNamespaceSchema extends Record<string, unknown> {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
    parent_id?: number;
    avatar_url: string;
    web_url: string;
}

interface CondensedProjectSchema extends Record<string, unknown> {
    id: number;
    web_url: string;
    name: string;
    path: string;
}

interface SimpleProjectSchema extends CondensedProjectSchema {
    description: string;
    name_with_namespace: string;
    path_with_namespace: string;
    created_at: string;
    default_branch: string;
    topics: string[] | null;
    ssh_url_to_repo: string;
    http_url_to_repo: string;
    readme_url: string;
    forks_count: number;
    avatar_url: string | null;
    star_count: number;
    last_activity_at: string;
    namespace: CondensedNamespaceSchema;
}

interface ProjectSchema extends SimpleProjectSchema {
    issues_template?: string;
    merge_requests_template?: string;
    mirror_trigger_builds?: boolean;
    container_registry_image_prefix: string;
    _links: {
        self: string;
        issues: string;
        merge_requests: string;
        repo_branches: string;
        labels: string;
        events: string;
        members: string;
        cluster_agents: string;
    };
    packages_enabled: boolean;
    empty_repo: boolean;
    archived: boolean;
    visibility: string;
    owner: Pick<UserSchema, 'id' | 'name' | 'created_at'>;
    resolve_outdated_diff_discussions: boolean;
    container_expiration_policy: {
        cadence: string;
        enabled: boolean;
        keep_n: number;
        older_than: string;
        name_regex: string;
        name_regex_keep?: null;
        next_run_at: string;
    };
    issues_enabled: boolean;
    merge_requests_enabled: boolean;
    wiki_enabled: boolean;
    jobs_enabled: boolean;
    snippets_enabled: boolean;
    container_registry_enabled: boolean;
    service_desk_enabled: boolean;
    can_create_merge_request_in: boolean;
    issues_access_level: string;
    repository_access_level: string;
    merge_requests_access_level: string;
    forking_access_level: string;
    wiki_access_level: string;
    builds_access_level: string;
    snippets_access_level: string;
    pages_access_level: string;
    analytics_access_level: string;
    container_registry_access_level: string;
    security_and_compliance_access_level: string;
    releases_access_level: string;
    environments_access_level: string;
    feature_flags_access_level: string;
    infrastructure_access_level: string;
    monitor_access_level: string;
    emails_disabled?: boolean;
    shared_runners_enabled: boolean;
    lfs_enabled: boolean;
    creator_id: number;
    import_status: string;
    open_issues_count: number;
    description_html: string;
    updated_at: string;
    ci_config_path: string;
    public_jobs: boolean;
    shared_with_groups?: string[];
    only_allow_merge_if_pipeline_succeeds: boolean;
    allow_merge_on_skipped_pipeline?: boolean;
    request_access_enabled: boolean;
    only_allow_merge_if_all_discussions_are_resolved: boolean;
    remove_source_branch_after_merge: boolean;
    printing_merge_request_link_enabled: boolean;
    merge_method: string;
    squash_option: string;
    enforce_auth_checks_on_uploads: boolean;
    suggestion_commit_message?: string;
    merge_commit_template?: string;
    squash_commit_template?: string;
    issue_branch_template?: string;
    autoclose_referenced_issues: boolean;
    external_authorization_classification_label: string;
    requirements_enabled: boolean;
    requirements_access_level: string;
    security_and_compliance_enabled: boolean;
    compliance_frameworks?: string[];
    permissions: {
        project_access?: null;
        group_access?: null;
    };
}

interface CondensedCommitSchema extends Record<string, unknown> {
    id: string;
    short_id: string;
    message: string;
    title: string;
    author_email: string;
    author_name: string;
    created_at: string;
}

interface CommitSchema extends CondensedCommitSchema {
    parent_ids?: string[];
    message: string;
    authored_date?: string;
    committer_name?: string;
    committer_email?: string;
    committed_date?: string;
    web_url: string;
}

interface CommitDiffSchema extends Record<string, unknown> {
    diff: string;
    new_path: string;
    old_path: string;
    a_mode?: string;
    b_mode: string;
    new_file: boolean;
    renamed_file: boolean;
    deleted_file: boolean;
}

interface RepositoryTreeSchema extends Record<string, unknown> {
    id: string;
    name: string;
    type: string;
    path: string;
    mode: string;
}

export { ProjectSchema, CommitSchema, CommitDiffSchema, RepositoryTreeSchema }