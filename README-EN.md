
[Wiki](https://gitee.com/smartchart/smartchart/wikis/pages) \|
[Community](https://www.smartchart.cn/) \|
[Documentation](https://help.smartchart.cn/) \|
[GitHub](https://github.com/JohnYan2017/SmartCharts) \|
[Gitee](https://gitee.com/smartchart/smartchart)

<p align="center">
	<a href="https://www.smartchart.cn"><img src="http://smartchart.cn/static/smartui/img/smartlogo.png" width="45%"></a>
</p>
<p align="center">
	<strong>A NoBI Platform That Connects Data to Insight</strong>
</p>
<p align="center">
	<a href="https://www.smartchart.cn">https://www.smartchart.cn</a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Release-V8.0-green.svg" alt="Release">
	<a target="_blank" href="https://www.python.org/downloads/release/python-390/">
		<img src="https://img.shields.io/badge/Python-3.6+-green.svg" />
	</a>
	<a href='https://gitee.com/smartchart/smartchart/members'><img src='https://gitee.com/smartchart/smartchart/badge/fork.svg?theme=dark' alt='fork'></a>
	<a href='https://gitee.com/smartchart/smartchart/stargazers'><img src='https://gitee.com/smartchart/smartchart/badge/star.svg?theme=dark' alt='star'></a>
	<a target="_blank" href='https://github.com/JohnYan2017/Echarts-Django'>
		<img src="https://img.shields.io/github/stars/JohnYan2017/Echarts-Django.svg?style=social" alt="github star"/>
	</a>
</p>
<p align="center">
	<a href="https://qm.qq.com/cgi-bin/qm/qr?k=eC34KwVvEtMvfh8Zyn1RSfYlzZvuvm7i&jump_from=webapi"><img src="https://img.shields.io/badge/QQ群-476715246-orange"/></a>
   <a target="_blank" href="https://www.smartchart.cn">
   <img src="https://img.shields.io/badge/Author-John%20Yan-ff69b4.svg" />
 </a>
 <a target="_blank" href="https://www.smartchart.cn">
   <img src="https://img.shields.io/badge/Copyright%20-@smartchart.cn-%23ff3f59.svg" />
 </a>
</p>

-------------------------------------------------------------------------------

[**中文文档**](README.md)

-------------------------------------------------------------------------------

### Introduction

SmartChart is a full-ecology data application management platform built on Python + Django, integrating dataset development, ECharts visualization, drag-and-drop layout, permission management, and AI agents. With only SQL (or Python) knowledge, you can rapidly build data dashboards, large screens, and business systems.

The platform is trusted by **5,000+** enterprises, with core projects running stably in multiple listed companies for **over 5 years**.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Data Service Layer                     │
│  API │ Self-Service Query │ Subscription │ AI │ Smart BI│
├─────────────────────────────────────────────────────────┤
│                   Application Layer                     │
│     SmartChart Visualization │ SmartPip Governance │ Form│
├─────────────────────────────────────────────────────────┤
│                   Platform Layer                        │
│    Data Pipeline │ Data Dev & Mgmt │ Multi-Source ETL   │
└─────────────────────────────────────────────────────────┘
```

| Module | Description |
|--------|-------------|
| SmartChart | Low-code visual analytics platform |
| SmartPip | Data governance platform |
| Data Services | API, self-service query, data subscription, AI assistant |

### Key Features

- A low-code development platform for data visualization, large screens, mobile reports, data middleware, and web applications
- Simple, agile, efficient, universal, and **highly customizable** — instantly elevate your project's quality
- Fully bridges front-end and back-end; supports chart data linkage, filtering, and drill-down; compatible with nearly all common databases
- Building-block drag-and-drop development — out of the box, easy to install, minimal dependencies, cross-platform
- Supports Chinese-style EXCEL-like reports and 3D scene dashboards
- Built-in OA organization and workflow engine — supports approval flow design, parallel branches, reject/withdraw/transfer
- Built-in APScheduler — supports scheduled dataset refresh and distributed master-slave mode
- Standalone admin panel — one-stop management for connection pools, datasets, dashboards, chart formats, and project groups
- Dataset type extensions: Agent, Tool, Chart, and API
- In-memory acceleration technology — significantly reduces database pressure
- True WYSIWYG drag-and-drop development — no canvas design required
- Dataset-as-a-Service — rapidly build data service APIs with low code
- Dashboard backup/restore/snapshot — meets enterprise-grade version control and deployment workflows
- User/group permission control with row-level and field-level data access policies
- Django plugin integration — infinitely extensible for your personalized applications
- Jupyter Notebook support for data development
- AI integration with DeepSeek, ChatGPT, ERNIE Bot, Tongyi, Alibaba Bailian, and more
- Enterprise WeChat / DingTalk SSO, third-party OAuth, and self-service user registration
- Customizable data entry, import, export, file upload, and more
- No redundant learning curve, **highly customizable** — yes, HIGHLY customizable!!

### Development Workflow

> Create Dashboard → Add Chart Component → Edit Dataset (write SQL) → Edit Chart (configure ECharts/HTML) → Drag-and-Drop Layout → Preview/Publish

![Dashboard](https://www.smartchart.cn/media/editor/微信截图_20211202163316_20211202163647765791.png)
![CRUD](https://foruda.gitee.com/images/1728362892391930153/e7a89b1d_5500438.png)
![smartchart](http://smartchart.cn/media/editor/smartvoice_20201224085323156045.png)

### Video Tutorials

| Version | Link |
|---------|------|
| 6.0 Introduction | [Bilibili](https://www.bilibili.com/video/BV1Md4y1h7iq) |
| Advanced Development | [Bilibili](https://www.bilibili.com/video/BV15S421o7kx) |
| 7.0 CRUD | [Bilibili](https://www.bilibili.com/video/BV17rAweeETt) |
| 7.0 CRUD Data | [Toutiao](https://www.toutiao.com/video/7500047932272624163/) |
| 7.0 AI Agent | [Toutiao](https://www.toutiao.com/video/7500035210919281163/) |
| Enterprise Digital Solution | [Bilibili](https://www.bilibili.com/video/BV1AY41157Y7) |

> V8.0 is continuously being released — follow smartAi on Toutiao for the latest updates.

-------------------------------------------------------------------------------

### Quick Start

#### 1. Install Python

- Download: [Python 3.9 Official](https://www.python.org/downloads/release/python-390/) (3.6+ recommended)
- **Windows**: Make sure to check **"Add to Path"** during installation

#### 2. Install SmartChart

```shell
# Option 1: Install from PyPI
pip install smartchart

# Upgrade
pip install smartchart -U
```

> **V8.0 Note**: pip package is not available for V8.0 at this time. Please contact us if needed.
> Since v7.9, SmartChart has been fully AI-powered as SmartAi. Before upgrading, run `smartchart makemigrations` first.

```shell
# Option 2: Install from release package
pip3 install smartchart-xxx-py3-none-any.whl

# Use mirror if download is slow
pip3 install -i https://mirrors.aliyun.com/pypi/simple smartchart-xxx-py3-none-any.whl
```

#### 3. Launch

```shell
# Local development
smartchart

# Server (remote access)
smartchart runserver 0.0.0.0:8000 --insecure --noreload

# Linux background process
nohup smartchart runserver 0.0.0.0:8000 --insecure --noreload &
```

After startup, visit: **http://127.0.0.1:8000**
- Default admin account: `admin` / `admin`

```shell
# Reset forgotten password
smartchart changepassword username
```

> Please read the [SmartChart Getting Started Guide](https://help.smartchart.cn/) for the complete setup walkthrough.

-------------------------------------------------------------------------------

### Design Philosophy

SmartChart's design philosophy is grounded in real-world application scenarios, emphasizing **agile development**, **data-driven design**, and **developer friendliness**.

| Principle | Description |
|-----------|-------------|
| Agile Data Platform | Designed for real-world scenarios, battle-tested in large enterprises for years |
| Low-Code, Not No-Code | Developer-friendly with full freedom to extend |
| Minimalist UI | Low-frequency features are hidden to reduce interface complexity |
| Data Highway | No proprietary language — just connects data to visualization |
| Progressive Experience | Accumulate charts and templates for rapid reuse |

-------------------------------------------------------------------------------

### Comparisons

#### vs. Traditional BI
- Traditional BI targets non-technical users with no-code approaches, resulting in limited visualization quality, low customization, slow performance, and high hardware requirements
- SmartChart targets technical users with low-code — better visualization, higher customization, faster performance, and broader applicability
- If your data/report developers are primarily in the technical department, SmartChart is the optimal choice

#### vs. Dashboard Designers
- Dashboard designers focus only on front-end effects (borders, decorations) without real data development capabilities
- SmartChart is a full-stack solution covering data development, visualization, version control, deployment, and embedding

#### vs. Data Platforms
- SmartChart is a component of the data platform stack — use it to complement data service and application capabilities
- If your data platform is Django-based, SmartChart is likely the best fit
- Our data platform can be introduced later with seamless SmartChart integration

#### vs. Low-Code Platforms
- Traditional low-code platforms target non-technical users with process-driven approaches
- SmartChart is built on real developer needs with higher openness and **data-driven** design

#### vs. AI Agents
- Common agents are either Python libraries or inflexible GUI-only tools
- SmartChart leverages its powerful data connectivity and visualization to enable low-code AI Agent development

-------------------------------------------------------------------------------

### Deployment Options

| Method | Use Case | Description |
|--------|----------|-------------|
| pip install | Development / personal use | Quick install and launch |
| uWSGI + Nginx | Linux production | Recommended production deployment |
| Offline | Air-gapped environments | Available with professional edition |

**Authentication**: Username/password, Enterprise WeChat OAuth, DingTalk OAuth, third-party OAuth, and email registration.

Full deployment documentation: [Deployment Guide](https://help.smartchart.cn/)

-------------------------------------------------------------------------------

### Contact & Support

Join our QQ group for community discussions:
**QQ Group: 476715246  Code: smartchart**

#### WeChat

Please include your company name and phone number when adding us on WeChat.

 <a href="https://work.weixin.qq.com/kfid/kfcded01b07b7ba963b" target="_blank"><img src="https://foruda.gitee.com/images/1662372287435411063/1c7ddbe7_5500438.png" width="200px"></a>

-------------------------------------------------------------------------------

#### Change Log

| Version | Highlights |
|---------|------------|
| V8.0 | Approval workflows, scheduled tasks, full UI overhaul, datasets upgraded to AI Agents, product evolved into SmartAi |
| V7.5 | Full AI agent support, ECharts 6.0, enhanced CRUD templates, drag-sort homepage |
| V7.1 | Optimized chart components, 3D model integration, WeCom/DingTalk SSO, dashboard favorites |
| V7.0 | Powerful CRUD template development, resource management, AI agent support, Excel import/export |
| V6.8 | ECharts 5.5, Feishu/WeCom connectors, vector DB client |
| V6.5 | Grid-assisted positioning, ds_filter function, enhanced data source icons |
| V6.0 | Complex reports, 3D scenes, mobile adaptation, Prometheus/InfluxDB connectors |
| V5.7 | Major template/graphics editor overhaul, MongoDB/ES connectors, API rate limiting |
| V5.0 | New UI, removed Bootstrap, 40 chart themes, custom themes, linkage drill-down UI |
| V4.0 | New 24/12 grid layout, drag-and-drop, HTML components, auto identity detection |

> Full changelog available at [Official Documentation](https://help.smartchart.cn/).
