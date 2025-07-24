# 需求

这是一个 n8n 自定节点仓库，主要用于封装 gitlab API 的调用，需求如下：

- 使用 @gitbeaker/rest 库进行 API 调用
- 支持通过预设凭证或在节点中动态输入 Host 与 Access Token 进行认证

具体需要封装的 API 如下：

- **文件 (Files)**
  - [ ] `GET /projects/:id/repository/tree` - 获取仓库文件树
  - [ ] `GET /projects/:id/repository/files/:file_path` - 获取文件内容

- **分支 (Branches)**
  - [ ] `GET /projects/:id/repository/branches` - 列出所有分支
  - [ ] `GET /projects/:id/repository/branches/:branch` - 获取单个分支信息
  - [ ] `POST /projects/:id/repository/branches` - 创建新分支
  - [ ] `DELETE /projects/:id/repository/branches/:branch` - 删除分支

- **提交 (Commits)**
  - [ ] `GET /projects/:id/repository/commits` - 列出仓库的提交
  - [ ] `GET /projects/:id/repository/commits/:id` - 获取单个提交
  - [ ] `GET /projects/:id/repository/commits/:id/diff` - 获取提交的差异
  - [ ] `GET /projects/:id/repository/compare` - 比较两个分支、标签或提交

- **合并请求 (Merge Requests)**
  - [ ] `GET /projects/:id/merge_requests` - 列出合并请求
  - [ ] `POST /projects/:id/merge_requests` - 创建合并请求
  - [ ] `PUT /projects/:id/merge_requests/:merge_request_iid` - 更新合并请求
  - [ ] `DELETE /projects/:id/merge_requests/:merge_request_iid` - 删除合并请求
