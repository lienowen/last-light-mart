# Last Light Mart / 最后一盏灯

移动端 H5 末世生存推理游戏。玩家在暴雨封锁的城市中调查人物、操作证物、组合线索，并决定幸存者的命运。

## 运行

```powershell
python -m http.server 8080
```

访问 `http://localhost:8080/story.html?v=60`。

## 验证

```powershell
npm test
```

当前版本使用单一状态控制器，包含中英文剧情、证物操作、推理分支、多个结局和夜班守店模式。
