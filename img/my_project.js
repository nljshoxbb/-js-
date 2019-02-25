
/*!
 * CodeMao mcpe mod editor
 * https://mcpe.codemao.cn/
 *
 * https://www.codemao.cn/
 *
 * Copyright CodeMao's clever men
 *
 * Date: 2017-07-07
 */
var ENABLE_MCPE_GUI = undefined;

var MCPE_LEVEL_DRONE_POINT = {
  x: 0,
  y: 0,
  z: 0
};
var MCPE_MOD_RUNTIME_ENVIRONMENT = "mcpe";
// 每0.05秒调用一次
function modTick() {
  MCPE_MOD_RUNTIME_ENVIRONMENT = "mcpe";
  if ((Player.getCarriedItem() == 369)) {
    Level.addParticle(14, ((~~(getPlayerX()*100)/100) - 1),((~~(getPlayerY()*100)/100) - 2),(~~(getPlayerZ()*100)/100), 0, 0, 0, 100);
    Level.addParticle(14, ((~~(getPlayerX()*100)/100) + 1),((~~(getPlayerY()*100)/100) - 2),(~~(getPlayerZ()*100)/100), 0, 0, 0, 100);
  }
}
Player.getEntity();
