# Bug-fix test report

Use this structure for each repair task. Replace placeholders with observed facts, keep all six sections, and repeat bug and test rows as needed. When a section has no activity, say so. Do not invent a ticket, confirmed root cause, review, test count, timing, or successful outcome to fill the template.

## Files and evidence

- Name the report `<YYYYMMDD-HHmmss>-<task-slug>-测试报告.md` using the user's local time. Use a short filesystem-safe slug without spaces, `#`, or parentheses. Reuse the same report for continued work on that task; add a numeric suffix on collision with a different task.
- Save it under the repaired project's `docs/bugfix-reports/`. `report-stem` means the complete filename without `.md`, including the date and `-测试报告` suffix.
- Only when there are images, create `assets/images/<report-stem>/` beside the report. Use names such as `bug-01-before.png`, `bug-01-after.png`, and numbered names for additional steps. Use the real image extension.
- Embed with `![Bug 01 修复前](assets/images/<report-stem>/bug-01-before.png)`. Replace `<report-stem>` before delivery. Use relative Markdown links for other retained evidence too; no absolute paths, remote image hosts, or HTML layouts.
- Keep paired images in consecutive blocks with a figure number and scenario caption. Use real captures, readable at normal preview size, with sensitive information masked before retention. Describe any masking or material differences in capture conditions.
- Without a screenshot, replace its entire image block with the reason and available textual evidence. Do not leave a placeholder image or make an empty image directory. Do not manufacture terminal screenshots from text logs.
- Retain any larger, sanitized logs needed for verification under `assets/evidence/<report-stem>/`; short outputs belong directly in fenced code blocks in the report. Preserve all linked evidence during cleanup.

## Report template

```markdown
# <任务简称> 测试报告

## 一、基本信息与结论

| 项目 | 内容 |
| --- | --- |
| 任务 / Issue | <任务描述；无 Issue 时注明> |
| 代码分支与测试版本 | <分支、提交及测试时未提交改动；前后状态分别记录> |
| 测试日期 | <日期、时间与时区> |
| 测试环境 | <实际系统、运行时、浏览器或服务版本> |
| 测试范围 | <本次 Bug、涉及模块及回归范围> |
| 测试结论 | <通过 / 失败 / 阻塞 / 未执行，并解释覆盖限制> |

## 二、验收标准对照

| Bug 编号 | 原始症状 | 预期行为 / 验收标准 | 验证方式 / 用例 | 结果 |
| --- | --- | --- | --- | --- |
| BUG-01 | <症状> | <可检查的标准> | <用例 ID、命令或操作> | <状态与说明> |

## 三、自动化测试结果

| 用例 / 测试层 | 类别 | 关联 Bug / 覆盖范围 | 执行命令 | 预期结果 | 实际结果 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| <用例 ID / 单元、集成、E2E 等> | <本次回归 / 既有套件> | <BUG-01 / 范围> | <实际命令> | <预期> | <实际输出摘要> | <通过 / 失败 / 阻塞 / 未执行> |

<按实际输出汇总通过、失败、跳过和未执行情况；说明统计范围，避免把套件与其子用例重复相加。耗时只填实测值。不适用自动化或无法运行时写明原因；人工验证单独标注。>

<附关键命令的工作目录（项目相对路径）、退出码和脱敏输出代码块，或链接保留的证据文件。区分修改前预期失败与修改后的回归结果。>

## 四、改动说明与前后证据

### BUG-01 <问题简称>

- 原始问题与复现步骤：<操作、数据、角色、环境>
- 根因：<经验证的原因；未确认时明确标注>
- 修复点：<涉及模块、项目相对文件路径与行为变化>
- 修改前：<实际失败表现、命令输出或测量值>
- 修改后：<同一场景复测的实际结果>

![BUG-01 修复前](assets/images/<report-stem>/bug-01-before.png)

图 1：BUG-01 修复前，<场景、失败表现和必要的采集条件>。

![BUG-01 修复后](assets/images/<report-stem>/bug-01-after.png)

图 2：BUG-01 修复后，<对应场景、实际表现，以及与修改前采集条件的差异>。

<无截图或仅有一侧截图时，删除缺失的图片块并说明原因。后端、命令行和性能问题用实际输出或指标对比，不把它们包装成界面截图。多个 Bug 重复本小节。>

## 五、代码审查与优化

| 问题 | 级别 | 处理 | 回归结果 |
| --- | --- | --- | --- |
| <实际审查发现> | <级别> | <处理> | <关联用例与结果> |

<未开展代码审查时删去空表并写“本次未开展代码审查”；不得编造审查记录。>

## 六、遗留事项与验收建议

- 未验证项目与原因：<包括未执行、跳过及受阻项目；无则注明>
- 剩余风险与待办：<尚未修复的问题、缺失回归测试的原因、环境限制及下一步>
- 用户复查步骤：<入口、测试角色、操作、预期观察，不包含凭据>
```

## Delivery check

- A passed overall conclusion requires the original symptoms to be resolved and the declared acceptance checks to pass. Missing coverage stays explicit; absence of a valid regression seam must be documented. A required check that failed, was blocked, or was not run prevents an unqualified pass. Report completion is separate from repair success.
- Check that every reported result has real execution evidence and that counts match their stated scope. An observed before-fix failure is baseline evidence, not a failed after-fix regression test.
- Replace all placeholders and remove unused sample rows and image blocks. Verify image files exist, decode, and render legibly in Markdown. Check the report using its own directory as the link base so moving the complete `bugfix-reports` folder preserves the images.
- Review text, images, and linked files for secrets and private data. Do not copy unrelated sample-project content into the report. Link the finished report in the final response with the actual result and remaining limitations.
