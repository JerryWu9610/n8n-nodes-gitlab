# 开发任务列表

这是一个根据我们的讨论和设计拆分的主要开发任务列表。我们将按照这个列表来推进项目。

- [x] **1. 环境搭建与项目初始化**
    - [x] 安装 `@gitbeaker/rest` 等核心依赖。

- [x] **2. 创建 GitLab API 凭证节点**
    - [x] 定义凭证类型 `gitlabApi`。
    - [x] 实现凭证包含 `host` 和 `accessToken` 两个字段。

- [ ] **3. 节点功能开发**
    - [x] **3.1 文件节点 (Files)**
        - [x] 创建 `GitLabFile.node.ts`
        - [x] 实现 `GET /projects/:id/repository/tree`
        - [x] 实现 `GET /projects/:id/repository/files/:file_path`
    - [x] **3.2 分支节点 (Branches)**
        - [x] 创建 `GitLabBranch.node.ts`
        - [x] 实现 `GET /projects/:id/repository/branches`
        - [x] 实现 `GET /projects/:id/repository/branches/:branch`
        - [x] 实现 `POST /projects/:id/repository/branches`
        - [x] 实现 `DELETE /projects/:id/repository/branches/:branch`
    - [x] **3.3 提交节点 (Commits)**
        - [x] 创建 `GitLabCommit.node.ts`
        - [x] 实现 `GET /projects/:id/repository/commits`
        - [x] 实现 `GET /projects/:id/repository/commits/:id`
        - [x] 实现 `GET /projects/:id/repository/commits/:id/diff`
        - [x] 实现 `GET /projects/:id/repository/compare`
    - [x] **3.4 合并请求节点 (Merge Requests)**
        - [x] 创建 `GitLabMergeRequest.node.ts`
        - [x] 实现 `GET /projects/:id/merge_requests`
        - [x] 实现 `POST /projects/:id/merge_requests`
        - [x] 实现 `PUT /projects/:id/merge_requests/:merge_request_iid`
        - [x] 实现 `DELETE /projects/:id/merge_requests/:merge_request_iid`
    - [ ] **3.5 通用功能**
        - [x] 实现混合认证模式（凭证 + 动态输入）

- [ ] **4. 完善节点文档**
    - [ ] 为每个节点和其所有操作编写清晰的用户文档。
    - [ ] 提供输入输出的示例。
