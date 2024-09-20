import { ReactElement } from 'react';

export type ChildrenType = { 
    children?: ReactElement | ReactElement[] 
}

export type OptionType = {
    key: string,
    value: string
}

export type DeveloperType = {
    id?: number,
    name: string,
    email: string
}

export type ProjectType = {
    id?: number,
    name: string,
    desc: string,
    path: string,
    created_at: string,
    http_url_to_repo: string,
    last_activity_at: string
}

export type ProjectsBranchesType = {
    id: string,
    name: string,
    branches: string[]
}

export type ExtractionType = {
    id: number,
    name: string,
    startDate: Date,
    projectsBranches: SelectedProjectBranchesType[],
    path: string,
    status: string,
    progressProjects?: string,
    progressCommits?: string,
    repository: RepositoryType,
    progLangs: ProgLangType[]
}

export type SelectedProjectBranchesType = {
    projectId: string,
    projectName: string,
    branch: string
}

export type ProgressLogType = {
    timestamp: Date,
    logText: string
}

export type PackageRemovalPatternType = {
    type: string,
    value: string
}

export type RankingType = {
    name: string,
    rangeStart: number | null
}

export type ProgLangType = {
    id?: string,
    name: string,
    desc?: string,
    sourceFiles: string,
    level: number,
    packageSeparator?: string,
    removingTLDPackages: boolean,
    patterns: string[],
    packageRemovalPatterns: PackageRemovalPatternType[],
    ignoringLinesPatterns: string[],
    scope: string,
    ranking?: RankingType[]
}

export type RepositoryType = {
    id: string,
    name: string,
    desc?: string,
    url: string,
    token: string
}

export type SkillTreeNodeType = {
    id: number,
    name: string,
    enabled: boolean,
    children: SkillTreeNodeType[]
    selected: boolean
}

export type RankingsFromSkillType = {
    extractionId: number,
    skillId: number,
    rankings: RankingType[]
}

export type DeveloperSkillMapType = {
    developerName: string,
    developerEmail: string,
    developerId: number,
    skillName: string,
    skillId: number,
    score: number,
    ranking: string,
    progLang: string,
    skillLocation: string,
    nrOfChangedLines: number
}

export type DeveloperProjectMapType = {
    developerName: string,
    developerEmail: string,
    developerId: number,
    projectId: number,
    projectName: string,
    projectDesc: string,
    projectPath: string,
    projectCreatedAt: Date,
    projectHttpUrlToRepo: string,
    score: number,
    nrOfChangedLines: number
}

export type ProjectSkillMapType = {
    projectId: number,
    projectName: string,
    projectDesc: string,
    projectPath: string,
    projectCreatedAt: Date,
    projectHttpUrlToRepo: string,
    skillName: string,
    skillId: number,
    score: number,
    ranking: string,
    progLang: string,
    skillLocation: string,
    nrOfChangedLines: number
}