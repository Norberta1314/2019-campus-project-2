define({ "api": [  {    "type": "DELETE",    "url": "/award/:id",    "title": "",    "description": "<p>删除奖项</p>",    "group": "admin",    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "DeleteAwardId"  },  {    "type": "DELETE",    "url": "/organization/:id",    "title": "",    "description": "<p>删除组织</p>",    "group": "admin",    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "DeleteOrganizationId"  },  {    "type": "GET",    "url": "/award/:id",    "title": "",    "description": "<p>查询奖项</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>奖项id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    id: 'xxx'\n    name: '季度之星'\n    organization: '蓝鲸'，\n    content: 'xxxxxx'，\n    heads: ['xxx', 'xxxx']，\n    level: '0'，\n    is_active: True，\n    start_time: '2014-12-31 18:20:1'，\n    end_time: '2014-12-31 18:20:1'，\n    applys: [{\n        name: 'xxx',\n        state: '1',\n        apply_des: 'xxxxx',\n        apply_time: '2014-12-31 18:20:1'，\n        attachment: 'x',\n        remark: 'xxxx'\n    }]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "GetAwardId"  },  {    "type": "GET",    "url": "/award/organizations",    "title": "",    "description": "<p>查询组织名录</p>",    "group": "admin",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"result\": \"John\",\n    \"message\":  [{\n        id: 'xxx'\n        name: '蓝鲸'，\n    }]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "GetAwardOrganizations"  },  {    "type": "GET",    "url": "/awards?page=?",    "title": "",    "description": "<p>查询奖项</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "page",            "description": "<p>第几页 不存在为第一页</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"counts\": \"15\",\n    \"awards\":  [{\n        id: 'xxx'\n        name: '季度之星'\n        organization: '蓝鲸'，\n        level: '0'，\n        is_active: True，\n        start_time: '2014-12-31 18:20:1'，\n        apply_count: '10'，\n        apply_award_count: '10'，\n    }]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "GetAwardsPage"  },  {    "type": "GET",    "url": "/organization/:id",    "title": "",    "description": "<p>查询组织</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>组织id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\n    id: 'xxx',\n    name: '蓝鲸'，\n    head: ['xxx', 'xxx'],\n    eva_member: ['xxxx','xxx'],\n    create_time: 'xxxx'\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "GetOrganizationId"  },  {    "type": "GEt",    "url": "/organizations?page=?",    "title": "",    "description": "<p>查询组织</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "page",            "description": "<p>第几页 不存在为第一页</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"counts\": \"xxxx\",\n    \"organizations\":  [{\n        id: 'xxx'\n        name: '蓝鲸'，\n        head: ['xxx', 'xxx'],\n        eva_member: ['xxxx','xxx'],\n        create_time: 'xxxx'\n    }]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "GetOrganizationsPage"  },  {    "type": "POST",    "url": "/award",    "title": "",    "description": "<p>创建一个奖项</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>奖项名称 非法字符过滤</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "content",            "description": "<p>评价条件 需要xss过滤</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "level",            "description": "<p>奖项级别 0: 中心级 1：部门级 2：小组级 4：公司级</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "organization_id",            "description": "<p>所属组织id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "start_time",            "description": "<p>开始时间</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "end_time",            "description": "<p>结束时间</p>"          },          {            "group": "Parameter",            "type": "Bool",            "optional": false,            "field": "have_attachment",            "description": "<p>是否允许附件</p>"          },          {            "group": "Parameter",            "type": "Bool",            "optional": false,            "field": "is_active",            "description": "<p>是否生效</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    name: \"蓝鲸\",\n    content: \"xxxxxx\", // 富文本\n    level: \"0\",\n    organization_id: \"23\",\n    start_time: \"2014-12-31 18:20:1\",\n    end_time: \"2014-12-31 18:20:1\",\n    have_attachment: true,\n    is_active: true,\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "PostAward"  },  {    "type": "POST",    "url": "/awards/clone",    "title": "",    "description": "<p>批量克隆奖项</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>奖项名称 非法字符过滤</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "content",            "description": "<p>评价条件 需要xss过滤</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "level",            "description": "<p>奖项级别 0: 中心级 1：部门级 2：小组级 4：公司级</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "organization",            "description": "<p>所属组织id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "start_time",            "description": "<p>开始时间</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "end_time",            "description": "<p>结束时间</p>"          },          {            "group": "Parameter",            "type": "Bool",            "optional": false,            "field": "have_attachment",            "description": "<p>是否允许附件</p>"          },          {            "group": "Parameter",            "type": "Bool",            "optional": false,            "field": "is_active",            "description": "<p>是否生效</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "[{\n    name: \"蓝鲸\",\n    content: \"xxxxxx\", // 富文本\n    level: \"0\",\n    organization: \"23\",\n    start_time: \"2014-12-31 18:20:1\",\n    end_time: \"2014-12-31 18:20:1\",\n    have_attachment: true,\n    is_active: true,\n}]",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "PostAwardsClone"  },  {    "type": "POST",    "url": "/organization",    "title": "",    "description": "<p>创建一个组织</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>组织名称</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "head",            "description": "<p>负责人</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "eva_member",            "description": "<p>评议人员</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    name: \"蓝鲸\",\n    head: [\n        \"7047xxxxx\",\n        \"2234xxxxx\",\n    ],\n    eva_member: [\n        \"xxxxxx\",\n        \"xxxxxx\",\n    ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "PostOrganization"  },  {    "type": "PUT",    "url": "/award/:id",    "title": "",    "description": "<p>更新奖项信息</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>奖项名称 非法字符过滤</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "content",            "description": "<p>评价条件 需要xss过滤</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "level",            "description": "<p>奖项级别 0: 中心级 1：部门级 2：小组级 4：公司级</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "organization_id",            "description": "<p>所属组织id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "start_time",            "description": "<p>开始时间</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "end_time",            "description": "<p>结束时间</p>"          },          {            "group": "Parameter",            "type": "Bool",            "optional": false,            "field": "have_attachment",            "description": "<p>是否允许附件</p>"          },          {            "group": "Parameter",            "type": "Bool",            "optional": false,            "field": "is_active",            "description": "<p>是否生效</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    name: \"蓝鲸\",\n    content: \"xxxxxx\", // 富文本\n    level: \"0\",\n    organization_id: \"23\",\n    start_time: \"2014-12-31 18:20:1\",\n    end_time: \"2014-12-31 18:20:1\",\n    have_attachment: true,\n    is_active: true,\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "PutAwardId"  },  {    "type": "PUT",    "url": "/organization/:id",    "title": "",    "description": "<p>更新组织信息</p>",    "group": "admin",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>组织名称</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "head",            "description": "<p>负责人</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "eva_member",            "description": "<p>评议人员</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    name: \"蓝鲸\",\n    head: [\n        \"7047xxxxx\",\n        \"2234xxxxx\",\n    ],\n    eva_member: [\n        \"xxxxxx\",\n        \"xxxxxx\",\n    ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "admin",    "name": "PutOrganizationId"  },  {    "type": "get",    "url": "/user",    "title": "",    "description": "<p>获取用户信息</p>",    "group": "all_user",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\n    'nick': 用户昵称,\n    'avatar': 用户头像,\n    'permission': [\n        'admin',\n        'head',\n        'apply'\n    ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "all_user",    "name": "GetUser"  },  {    "type": "GET",    "url": "/index/applys",    "title": "",    "description": "<p>首页可以申请list</p>",    "group": "apply",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"counts\": \"15\",\n    \"awards\":  [\n    {\n        award_id: 'xx',\n        organization: 'xxx',\n        apply_award: 'xxx',\n        award_level: 'xxx',\n        state: 'xxx',\n        count: 'xxx'\n    }\n    ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "GetIndexApplys"  },  {    "type": "GET",    "url": "/index/last",    "title": "",    "description": "<p>历史获奖</p>",    "group": "apply",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"counts\": \"15\",\n    \"awards\":  [\n    {\n        award_id: 'xx',\n        organization: 'xxx',\n        apply_award: 'xxx',\n        award_state: 'xxx',\n        state: 'xxx',\n        count: 'xxx'\n    }\n    ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "GetIndexLast"  },  {    "type": "GET",    "url": "/my/apply/:id",    "title": "",    "description": "<p>我的申请查询</p>",    "group": "apply",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>我的申请id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n award: {\n         id: 'xxx'\n         name: '季度之星'\n         organization: '蓝鲸'，\n         content: 'xxxxxx'，\n         heads: ['xxx', 'xxxx']，\n         level: '0'，\n         is_active: True，\n         start_time: '2014-12-31 18:20:1'，\n         end_time: '2014-12-31 18:20:1'，\n     },\n myapply: {\n     apply_id: 申请id\n     apply_info: \"申报人/团队\", 非法字符校验\n     content: \"事迹介绍\", // xss 过滤 非法字符校验\n     state: '1',\n     remark: 'xxxx',\n     attachment:     {\n         \"url\": \"http://pqg00vuko.bkt.clouddn.com/None/%E6%9C%AA%E5%91%BD%E5%90%8D%E8%A1%A8%E5%8D%95.png\",\n         \"attachment_name\": \"未命名表单.png\",\n         \"attachment_id\": 1\n      },\n }\n\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "GetMyApplyId"  },  {    "type": "GET",    "url": "/my/applys?page=?",    "title": "",    "description": "<p>我的申请list</p>",    "group": "apply",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "page",            "description": "<p>第几页 无 默认第一页</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"counts\": \"15\",\n    \"awards\":  [{\n        apply_id: 'xxx'\n        apply_info: '季度之星'\n        award_id: '12'，\n        organization: 'xxxx'，\n        apply_award: 'xxx'，\n        award_state: True or False，\n        state: '0'，-1 未申报 0 申报中 1 未通过 2 已通过 3未获奖 4 已获奖\n        apply_time: '2014-12-31 18:20:1'，\n    },\n    {\n        award_id: 'xx',\n        organization: 'xxx',\n        apply_award: 'xxx',\n        award_state: 'xxx',\n        state: 'xxx',\n    }\n    ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "GetMyApplysPage"  },  {    "type": "GET",    "url": "/myapply/award/:id",    "title": "",    "description": "<p>申请查询奖项详细信息</p>",    "group": "apply",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>奖项id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    id: 'xxx'\n    name: '季度之星'\n    organization: '蓝鲸'，\n    content: 'xxxxxx'，\n    heads: ['xxx', 'xxxx']，\n    level: '0'，\n    is_active: True，\n    start_time: '2014-12-31 18:20:1'，\n    end_time: '2014-12-31 18:20:1'，\n    have_attachment: 'true，\n\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "GetMyapplyAwardId"  },  {    "type": "POST",    "url": "/attachenment",    "title": "",    "description": "<p>上传附件</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "File",            "optional": false,            "field": "file",            "description": "<p>上传的文件</p>"          }        ]      }    },    "group": "apply",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\"url\": \"http://pqg00vuko.bkt.clouddn.com/None/%E6%9C%AA%E5%91%BD%E5%90%8D%E8%A1%A8%E5%8D%95.png\",\n\"attachment_name\": \"未命名表单.png\",\n\"attachment_id\": 1\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "PostAttachenment"  },  {    "type": "POST",    "url": "/my/apply/:id",    "title": "",    "description": "<p>申请一个奖项</p>",    "group": "apply",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>申请的奖项id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "apply_info",            "description": "<p>申报人/团队 需要xss过滤</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "apply_des",            "description": "<p>事迹介绍</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "attachment_id",            "description": "<p>附件id 无就-1</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    apply_info: \"申报人/团队\", 非法字符校验\n    apply_des: \"事迹介绍\", // xss 过滤 非法字符校验\n    attachment_id: \"233\",\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "PostMyApplyId"  },  {    "type": "PUT",    "url": "/my/apply/:id",    "title": "",    "description": "<p>更新我的申请 兼容重新申请</p>",    "group": "apply",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>申请id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "apply_info",            "description": "<p>申报人/团队 需要xss过滤</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "content",            "description": "<p>事迹介绍</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "attachment_id",            "description": "<p>附件id 无就-1</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    apply_id: 申请id\n    apply_info: \"申报人/团队\", 非法字符校验\n    content: \"事迹介绍\", // xss 过滤 非法字符校验\n    attachment_id: \"233\",\n    is_reapply: true\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "apply",    "name": "PutMyApplyId"  },  {    "type": "GET",    "url": "/my/checks?page=?",    "title": "",    "description": "<p>查询我的审核</p>",    "group": "head",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "page",            "description": "<p>第几页 无 默认第一页</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"counts\": \"15\",\n    \"awards\":  [{\n        apply_id: 'xxx'\n        apply_info: '季度之星'\n        award_id: '12'，\n        award_name: 'xxxx'，\n        organization: 'xxxx'，\n        apply_award: 'xxx'，\n        award_state: True or False，\n        state: '0' 0 申报中 1 未通过 2 已通过 3未获奖 4 已获奖\n        apply_time: '2014-12-31 18:20:1'，\n        op_user: 'xxxxx'\n    }]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "head",    "name": "GetMyChecksPage"  },  {    "type": "PUT",    "url": "/my/check/award/:apply_id",    "title": "",    "description": "<p>评奖</p>",    "group": "head",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>申请id</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    remark: '评语'\n    state: \"3/4\" 3 未获奖 4 未获奖\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "head",    "name": "PutMyCheckAwardApply_id"  },  {    "type": "PUT",    "url": "/my/check/pass/:apply_id",    "title": "",    "description": "<p>通过申请</p>",    "group": "head",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>申请id</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "head",    "name": "PutMyCheckPassApply_id"  },  {    "type": "PUT",    "url": "/my/check/reject/:apply_id",    "title": "",    "description": "<p>驳回申请</p>",    "group": "head",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>申请id</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "home_application/views.py",    "groupTitle": "head",    "name": "PutMyCheckRejectApply_id"  }] });
