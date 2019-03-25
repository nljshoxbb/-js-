const list = [
  { name: "中国", id: 0, pid: 0 },
  { name: "广东", id: 1, pid: 0 },
  { name: "深圳", id: 2, pid: 1 },
  { name: "湖南", id: 3, pid: 0 },
  { name: "长沙", id: 4, pid: 3 }
];

const finalList = [
  {
    name: "中国",
    id: 0,
    children: [
      {
        name: "广东",
        id: 1,
        pid: 0,
        children: [{ name: "深圳", id: 2, pid: 1 }]
      },
      {
        name: "湖南",
        id: 3,
        pid: 0,
        children: [{ name: "长沙", id: 4, pid: 3 }]
      }
    ]
  }
];

