(function (ly) {
    var GameRole = (function (_super) {
        __extends(GameRole, _super);
        function GameRole(sceneMgr) {
            var _this = _super.call(this, sceneMgr) || this;
            var s = _this;
            s._canRevive = true;
            s._clkRect = new Laya.Rectangle;
            s._clkRect.copyFrom(GameRole.Default_ClkRect);
            s._myRoundObjs = [];
            s._myCMDTips = [];
            s._numberList = [];
            s._effectList = [];
            s._buffList = [];
            s._buffEffects = [];
            s._bodyRange = [];
            s.historyRouteMax = 20;
            s.buffValueReset();
            s.init();
            return _this;
        }
        GameRole.prototype.init = function () {
            var s = this;
            s._attackTimeTicker = new ly.TimeTicker(s._scene);
            s._moveTimeTicker = new ly.TimeTicker(s._scene);
            s._hitTimeTicker = new ly.TimeTicker(s._scene);
            s.hitBackTimeTicker = new ly.TimeTicker(s._scene);
            s.numShowTimeTicker = new ly.TimeTicker(s._scene);
            s._passiveSkillList = [];
            s._skillList = [];
            s._skillCDList = {};
            s._skillPreCDList = {};
            s._lastSkillFailList = {};
            s._effectDatas = [];
            s._effectDatas[ly.EffectType.SINGLE._id] = new ly.Effect(s, ly.EffectType.SINGLE);
            s._effectDatas[ly.EffectType.ENVIR._id] = new ly.Effect(s, ly.EffectType.ENVIR);
            s._effectDatas[ly.EffectType.BULLET._id] = new ly.Effect(s, ly.EffectType.BULLET);
            s._effectDatas[ly.EffectType.ESPO._id] = new ly.Effect(s, ly.EffectType.ESPO);
            s._effectDatas[ly.EffectType.FULL._id] = new ly.Effect(s, ly.EffectType.FULL);
        };
        GameRole.prototype.getRoleName = function () {
            return this.nameObj ? this.nameObj.getNameText() : "";
        };
        GameRole.prototype.setOwner = function (val) {
            var s = this;
            s._owner = val;
            s.setCamp(val ? val._campObj : { camp: 0 });
        };
        GameRole.prototype.getOwner = function () {
            return this._owner ? this._owner : this;
        };
        GameRole.prototype.isFallSts = function () {
            return this._sts == ly.StsType.FALL;
        };
        GameRole.prototype.setCamp = function (campObj) {
            var s = this;
            s._campObj = campObj;
            s._camp = s._campObj.camp;
        };
        GameRole.prototype.addHate = function (r) {
            var s = this;
            if (r._camp == s._camp || r._gameRoleType == ly.GameRoleType.PARTNER)
                return;
            if (!s.inMyRange(r, s.maxSkillRange) || r._isDead)
                return;
            if (s.hateList == null)
                s.hateList = new ly.KeyArray("id");
            var d = s.hateList.getByKey(r._id);
            if (d == null)
                s.hateList.push(ly.HateData.create(r._id, r, s._scene.timeTick));
            else
                d.time = s._scene.timeTick;
        };
        GameRole.prototype.addBuffAttrVal = function (id, val) {
            var s = this;
            s._buffTypesAttr[id] = s._buffTypesAttr[id] ? s._buffTypesAttr[id] + val : val;
        };
        GameRole.prototype.getAttr = function (type) {
            var val = this._typesAttr && this._typesAttr[type];
            return val == null ? 0 : ly.AttrItmDefineCfg.ins.getRealAttr(type, val);
        };
        GameRole.prototype.setAttr = function (typesAttr) {
            var i, len;
            var s = this;
            if (typesAttr == null)
                return;
            this._typesAttr = {};
            var type, value;
            len = typesAttr.length;
            for (i = 0; i < len; ++i) {
                type = typesAttr[i].type;
                value = typesAttr[i].value;
                if (type == 115) {
                    if (value > 0)
                        s._canRevive = true;
                }
                else if (type == 119) {
                    if (value > 0)
                        s._ignoreRevive = true;
                }
                s._typesAttr[type] = Math.ceil(value);
                if (type == 121)
                    s._atk = s._typesAttr[type];
            }
        };
        GameRole.prototype.setAttr2 = function (typesAttr) {
            var s = this;
            s._typesAttr = typesAttr;
        };
        GameRole.prototype.setExtAttr = function (extAttr) {
            var s = this;
            s._extAttr = extAttr;
        };
        GameRole.prototype.getExtAttr = function () {
            var s = this;
            return s._extAttr || [];
        };
        GameRole.prototype.setFunParam = function (funcType, param) {
            if (param === void 0) { param = null; }
            var s = this;
            s.funcType = funcType;
            s.param = param;
        };
        GameRole.prototype.addSkillData = function (obj) {
            var s = this;
            if (obj.skillCfg.activeSkill == 2) {
                if (s.getPassiveSkillData(obj.skillId))
                    return;
                if (s._scene._isMMO && !s.getPassiveSkillData(obj.skillId)) {
                    s.addMMOBuffByCfg(s, obj.skillCfg.buff, new ly.OwnerData(s, obj), s._camp);
                    s._passiveSkillList.push(obj);
                }
                return;
            }
            if (s.getSkillData(obj.skillId))
                return;
            s._skillList.push(obj);
        };
        GameRole.prototype.clearSkillList = function () {
            var s = this;
            s._skillList.length = 0;
            s._passiveSkillList.length = 0;
        };
        GameRole.prototype.addSkillByList = function (skillList) {
            var j, len2;
            var skillId;
            var skillCfg;
            var s = this;
            len2 = skillList.length;
            for (j = 0; j < len2; ++j) {
                skillId = skillList[j].skillId;
                skillCfg = ly.Conf.getMMOSkill(skillId);
                if (skillCfg) {
                    s.addSkillData({
                        skillId: skillId,
                        skillCfg: skillCfg,
                        cd: skillCfg.cd,
                        preCD: skillCfg.preCd
                    });
                }
            }
        };
        GameRole.prototype.skillDataChange = function () {
            var s = this;
            s._skillList.sort(function (a, b) {
                if (a.skillCfg.priority < b.skillCfg.priority)
                    return -1;
                return 1;
            });
            var len;
            var max = 0;
            len = s._skillList.length;
            while (--len > -1) {
                max = Math.max(s.getAttackRangeMax(s._skillList[len]), max);
                s._skillToFlag |= s._skillList[len].skillCfg.campFlag;
            }
            s.maxSkillRange = max;
            if (s.isMyPlayer) {
                C.GlbData.notify.event(5051, s);
            }
        };
        GameRole.prototype.getAtkSkill = function () {
            var i, len;
            var s = this;
            var t, skillID;
            var skillData;
            t = Date.now();
            len = s._skillList.length;
            for (i = 0; i < len; ++i) {
                skillID = s._skillList[i].skillId;
                if (t - (s._skillPreCDList[skillID] | 0) > s._skillList[i].preCD && t - (s._skillCDList[skillID] | 0) > s._skillList[i].cd) {
                    skillData = s._skillList[i];
                }
            }
            return skillData;
        };
        GameRole.prototype.setHpBar = function (objID, hideInterval) {
            if (hideInterval === void 0) { hideInterval = NaN; }
            var s = this;
            if (objID == null) {
                s._hpHeight = 0;
                if (s.hpEffect) {
                    s.hpEffect.del();
                    s.hpEffect = null;
                }
                return;
            }
            if (s.hpEffect) {
                var cfg = void 0;
                if (s.hpEffect.cfg.roleID != objID) {
                    cfg = ly.RoleConfig.getObjConfig(objID);
                    s.hpEffect.parseConfig(cfg.roleType, cfg);
                    s.hpEffect.resetSkin(cfg.skin);
                }
            }
            else
                s.hpEffect = s._scene.createBarObj(s, ly.RoleType.BAR_OBJ, objID, 0, s._headJumpH, 0, 0);
            s.hpEffect.hideInterval = hideInterval;
            if (!s._scene._isMMO && s._gameRoleType == ly.GameRoleType.PARTNER) {
                s.hpEffect.setRoleBarVisible(false);
            }
            s._hpHeight = 14;
            s.setHp(s._hp, s._hpMax, s._shieldHp, false);
            if (!s._visible)
                s.hpEffect.setVisible(s._visible);
        };
        GameRole.prototype.delTip = function () {
            var s = this;
            if (s.tipEffect) {
                s.tipEffect.del();
                s.tipEffect = null;
            }
        };
        GameRole.prototype.addTip = function (msg, objID, playEndDead) {
            if (objID === void 0) { objID = ly.RoleID.CMD_TIP; }
            if (playEndDead === void 0) { playEndDead = true; }
            var s = this;
            var tipObj;
            tipObj = s._scene.createTipObj(s, ly.RoleType.TIP_OBJ, objID, 0, s._headJumpH);
            tipObj.playEndDead = playEndDead;
            tipObj.setName(msg);
        };
        GameRole.prototype.setTip = function (msg, objID) {
            if (objID === void 0) { objID = ly.RoleID.CMD_TIP; }
            var s = this;
            if (objID == null) {
                s._tipHeight = 0;
                if (s.tipEffect) {
                    s.tipEffect.setSts(ly.StsType.DEATH);
                    s.tipEffect = null;
                }
                return;
            }
            if (s.tipEffect) {
                var cfg = void 0;
                if (s.tipEffect.cfg.roleID != objID) {
                    cfg = ly.RoleConfig.getObjConfig(objID);
                    s.tipEffect.parseConfig(cfg.roleType, cfg);
                    s.tipEffect.resetSkin(cfg.skin);
                }
            }
            else
                s.tipEffect = s._scene.createTipObj(s, ly.RoleType.TIP_OBJ, objID, 0, s._headJumpH);
            s.tipEffect.setName(msg);
            s._tipHeight = 31;
            if (!s._visible)
                s.tipEffect.setVisible(s._visible);
        };
        GameRole.prototype.setNameSize = function (size) {
            var s = this;
            if (s.nameObj)
                s.nameObj.setNameSize(size);
        };
        GameRole.prototype.setNameColor = function (color) {
            var s = this;
            if (s.nameObj)
                s.nameObj.setNameColor(color);
        };
        GameRole.prototype.setName = function (name, objID) {
            if (objID === void 0) { objID = ly.RoleID.NAME; }
            var s = this;
            s._nickName = name;
            if (name == null) {
                if (s.nameObj) {
                    s.nameObj.del();
                    s.nameObj = null;
                }
                return;
            }
            if (s.nameObj && s.nameObj.getNameText() == name && s.nameObj.roleID == objID)
                return;
            if (s.nameObj) {
                var cfg = void 0;
                if (s.nameObj.cfg.roleID != objID) {
                    cfg = ly.RoleConfig.getObjConfig(objID);
                    s.nameObj.parseConfig(cfg.roleType, cfg);
                    s.nameObj.resetSkin(cfg.skin);
                }
            }
            else
                s.nameObj = s._scene.createNameObj(s, ly.RoleType.NAME_OBJ, objID, 0, 0);
            s.nameObj.setName(name);
            if (!s._visible)
                s.nameObj.setVisible(s._visible);
        };
        GameRole.prototype.getName = function () {
            var s = this;
            return s._nickName;
        };
        GameRole.prototype.setCid = function (cid) {
            var s = this;
            s._occ = cid;
        };
        GameRole.prototype.getCid = function () {
            var s = this;
            return s._occ;
        };
        GameRole.prototype.setLevel = function (lv) {
            var s = this;
            s._level = lv;
        };
        GameRole.prototype.getLevel = function () {
            var s = this;
            return s._level;
        };
        GameRole.prototype.setConfig = function (cfg) {
            var s = this;
            _super.prototype.setConfig.call(this, cfg);
            s._smartFunc = s[cfg.smart];
            s._canRevive = !s.cfg.eliminate;
            if (cfg.hp != null)
                s.setHp(cfg.hp, cfg.hp);
            s.ignoreMoveStopRole = cfg.ignoreMoveStopRole != null;
            if (s._scene._isMMOPvp) {
                s._scene.setRange(s);
            }
            else {
                s.setRange(s._cfg.fieldWar, s._cfg.fieldPatrol, s._cfg.fieldView);
            }
            s.hurtColor = ly.TintColor.HURT;
        };
        GameRole.prototype.changeSmart = function (funName) {
            var s = this;
            if (s._smartName == funName)
                return;
            s.outSmart(s._smartName);
            s.inSmart(funName);
        };
        GameRole.prototype.inSmart = function (funName) {
            var s = this;
            s._smartName = funName;
            s._smartFunc = this[funName];
            if (funName == ly.SmartType.FOLLOW) {
                s._historyRoute = [];
                s._lastDis = ly.PositionUtil.calculateDistance(s._absX, s._absY, s._scene._leaderRole._absX, s._scene._leaderRole._absY);
            }
        };
        GameRole.prototype.outSmart = function (funName) {
            var s = this;
            s._new_behavior = -1;
            s._followHistoryRoute = null;
            s._new_DeflectionInitAgl = s._new_followDeflectionAngle = NaN;
            if (funName == ly.SmartType.MMO) {
                s.resetMMOSmartState();
            }
        };
        GameRole.prototype.moveDir = function (agl, speed, ignoreMoveStopRole) {
            if (speed === void 0) { speed = NaN; }
            if (ignoreMoveStopRole === void 0) { ignoreMoveStopRole = null; }
            var s = this;
            var moveState;
            moveState = _super.prototype.moveDir.call(this, agl, speed, ignoreMoveStopRole);
            if (moveState && moveState.result >= ly.MoveResult.PASS)
                s.inArea();
            return moveState;
        };
        GameRole.prototype.create = function (sts, dir, x, y, pr, skin, showMap) {
            if (sts === void 0) { sts = 0; }
            if (dir === void 0) { dir = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (pr === void 0) { pr = null; }
            if (skin === void 0) { skin = null; }
            if (showMap === void 0) { showMap = null; }
            _super.prototype.create.call(this, sts, dir, x, y, pr, skin, showMap);
            var s = this;
            s.inArea();
        };
        GameRole.prototype.resetCreateTime = function (t) {
            this._createTime = t;
        };
        GameRole.prototype.setSceneParam = function (cfg) {
            _super.prototype.setSceneParam.call(this, cfg);
            var s = this;
            s.inArea();
        };
        GameRole.prototype.setSts = function (sts, direction, actionCfg, stsEndCall, thisObj) {
            if (sts === void 0) { sts = 0; }
            if (direction === void 0) { direction = -1; }
            if (actionCfg === void 0) { actionCfg = null; }
            if (stsEndCall === void 0) { stsEndCall = null; }
            if (thisObj === void 0) { thisObj = null; }
            var s = this;
            if (s._sts == ly.StsType.SEND_OUT && sts != ly.StsType.SEND_IN)
                return;
            if (ly.MMOBuffLogic.hasBuffLimit(s) && !ly.StsType.cannotAction(sts))
                return;
            _super.prototype.setSts.call(this, sts, direction, actionCfg, stsEndCall, thisObj);
            s.setActionInvert(direction);
            if (ly.StsType.isDeadSts(s._sts)) {
                s._isDead = true;
                GlobalData.notify.event(5060, s);
                s.outArea();
                s.setName(null);
            }
            if (sts == ly.StsType.SEND_OUT) {
                if (s.shadowEffect)
                    s.shadowEffect.setDisplayVisible(false);
            }
            s._attackFrameIndex = s._skinPart.curRate;
            if (ly.StsType.attackAction(s._sts)) {
                var t = s._scene.timeTick;
                if (s._lockTarget) {
                    var bullet = void 0, hit = void 0, envir = void 0, espo = void 0;
                    bullet = s.effectGet(ly.EffectType.BULLET);
                    if (bullet.hasDelayTime())
                        bullet.addEffect(t + bullet.delay, null, 0, s.getBulletTargets());
                    envir = s.effectGet(ly.EffectType.ENVIR);
                    if (envir.hasDelayTime())
                        envir.addEffect(t + envir.delay, null, 0, s.getBulletTargets());
                    hit = s.effectGet(ly.EffectType.SINGLE);
                    if (!bullet.hasEffectCfg && hit.hasDelayTime())
                        s.addHitEffectToTarget(t + hit.delay);
                    if (!s.hasAttachEvent(sts, ly.AttachEventKey.EXPLOSION) && !s.effectGet(ly.EffectType.FULL).hasEffectCfg) {
                        espo = s.effectGet(ly.EffectType.ESPO);
                        espo.addEffect(t + espo.delay);
                    }
                    s._attackTimeTicker.init(t, NaN);
                }
                else if (s._ownerData && s._ownerData._skillData) {
                    var mmoSkillCfg = void 0;
                    mmoSkillCfg = s._ownerData._skillData.skillCfg;
                    if (mmoSkillCfg.action != s._sts)
                        return;
                    s.addMMOBuffByCfg(s, mmoSkillCfg.buff, s._ownerData);
                    var i = void 0, len = void 0;
                    len = mmoSkillCfg.randBuff.length;
                    if (len > 0) {
                        for (i = 0; i < len; ++i)
                            s.addMMOBuffByCfg(s, mmoSkillCfg.randBuff[i], s._ownerData, 1, null, mmoSkillCfg.buffWeight[i]);
                    }
                    s.operSkillEffect(s._ownerData);
                    if (mmoSkillCfg.actionTime > 0) {
                        s._skinPart.playRate = mmoSkillCfg.actionTime * (1 + s.buffValues[ly.BuffEType.ATK_SPEED]);
                        s._skinPart.durationPlayRate = true;
                    }
                    else {
                        s._skinPart.playRate = 1;
                    }
                }
            }
        };
        GameRole.prototype.operSkillEffect = function (ownerData) {
            var s = this;
            var mmoSkillCfg;
            var t;
            t = s._scene.timeTick;
            mmoSkillCfg = ownerData._skillData.skillCfg;
            if (mmoSkillCfg.ballisticEffect && mmoSkillCfg.ballisticEffect.length > 0) {
                var tX = void 0, tY = void 0;
                var len = void 0;
                if (mmoSkillCfg.condition == ly.PeakType.LOCK_POSITION && s._warnSkillPos) {
                    len = s._warnSkillPos.length;
                    if (len > 0) {
                        while (len > 1) {
                            tX = s._warnSkillPos[len - 2];
                            tY = s._warnSkillPos[len - 1];
                            ly.MMOEffect.addEffect(s, ownerData, null, t, ly.EffectType.BULLET, mmoSkillCfg.ballisticEffect, tX, tY, s._direction);
                            len -= 2;
                        }
                    }
                }
                else {
                    len = s._mmoTargetRoles.length;
                    if (len > 0) {
                        while (--len > -1) {
                            tX = s._mmoTargetRoles[len]._absX;
                            tY = s._mmoTargetRoles[len]._absY;
                            ly.MMOEffect.addEffect(s, ownerData, null, t, ly.EffectType.BULLET, mmoSkillCfg.ballisticEffect, tX, tY, s._direction, s._mmoTargetRoles[len]._headJumpH * 0.5);
                        }
                    }
                    else {
                        var deg = ly.DirectionType.getDirectorDeg(s._direction);
                        tX = s._absX + ly.MathUtil.cos(deg) * ly.DriftObj.MAX_DIS;
                        tY = s._absY + ly.MathUtil.sin(deg) * ly.DriftObj.MAX_DIS;
                        ly.MMOEffect.addEffect(s, ownerData, null, t, ly.EffectType.BULLET, mmoSkillCfg.ballisticEffect, tX, tY, s._direction);
                    }
                }
            }
            if (mmoSkillCfg.environmentEffect && mmoSkillCfg.environmentEffect.length > 0)
                ly.MMOEffect.addEffect(s, ownerData, null, t, ly.EffectType.ENVIR, mmoSkillCfg.environmentEffect, NaN, NaN);
            if (mmoSkillCfg.explosionEffect && mmoSkillCfg.explosionEffect.length > 0)
                ly.MMOEffect.addEffect(s, ownerData, null, t, ly.EffectType.ESPO, mmoSkillCfg.explosionEffect, NaN, NaN);
            if (mmoSkillCfg.fullScreenEffect && mmoSkillCfg.fullScreenEffect.length > 0)
                ly.MMOEffect.addEffect(s, ownerData, null, t, ly.EffectType.FULL, mmoSkillCfg.fullScreenEffect);
            if (mmoSkillCfg.attackSound)
                modules.n_sound.SoundCtrl.instance.playSoundByName(mmoSkillCfg.attackSound);
        };
        GameRole.prototype.barrierStateCheck = function () {
            var s = this;
            if (s._gameRoleSubType == ly.GameRoleSubType.STATIC || s._gameRoleSubType == ly.GameRoleSubType.EXPLORE || s._gameRoleSubType == ly.GameRoleSubType.EXPLORE_BOSS)
                return;
            _super.prototype.barrierStateCheck.call(this);
        };
        GameRole.prototype.addMMOLockHitToTarget = function (target, mmoSkillCfg) {
            var s = this;
            if (mmoSkillCfg.hitEffect && mmoSkillCfg.hitEffect.length > 0) {
                ly.MMOEffect.addEffect(target, s._ownerData, null, 0, ly.EffectType.SINGLE, mmoSkillCfg.hitEffect);
                return true;
            }
            return false;
        };
        GameRole.prototype.addMMOHitToTarget = function (target, index, atkIndex, hurtAdd, doubleHit) {
            if (atkIndex === void 0) { atkIndex = 0; }
            if (hurtAdd === void 0) { hurtAdd = null; }
            if (doubleHit === void 0) { doubleHit = false; }
            var s = this;
            var atkData;
            var per;
            var mmoSkillCfg;
            var expTree;
            target.addHate(s.getOwner());
            mmoSkillCfg = s._ownerData._skillCfg;
            atkData = ly.TargetMMOData.create(mmoSkillCfg, s.getHitType(target));
            atkData.role = target;
            atkData.fId = s._ownerData._id;
            atkData.tId = target._id;
            atkData.isDouble = doubleHit;
            var value, notHit;
            notHit = atkData.hitType == 0 || atkData.hitType == 5;
            if (!notHit) {
                expTree = hurtAdd ? hurtAdd[0] : mmoSkillCfg.skillNub[index];
                expTree.publicDef.addOpDef("attr2", new ly.OpAttr(target._typesAttr));
                expTree.publicDef.addOpDef("attr", new ly.OpAttr(s._ownerData._typesAttr));
                expTree.publicDef.addOpDef("attr3", new ly.OpAttr(s._ownerData._typesAttr));
                expTree.publicDef.addOpDef("nub", new ly.OpSkillNub(s._ownerData, 1, 0, s));
                expTree.publicDef.addOpDef("hp", new ly.OpHP(1, 0, s));
                value = expTree.getValue();
                per = value == value ? value / 1000 : 0;
                atkData.ignoreShield = mmoSkillCfg.skillNub[3] > 0;
                s.calMMOHurt(per, atkData, index);
            }
            target.setMMODamage(-1, null, s._ownerData, atkData);
            if (notHit)
                return false;
            if (doubleHit && s._ownerData.ownerIsValid())
                s._ownerData._owner.addFlowNumber(ly.RoleID.MMO_HP_NUM, "连击");
            s.addMMOHitEffect(target, s._ownerData);
            if (s._ownerData.mmoSkillHitDict == null)
                s._ownerData.mmoSkillHitDict = {};
            if (s._ownerData.mmoSkillHitDict[target._id] == null)
                s._ownerData.mmoSkillHitDict[target._id] = { hurt: 0, heal: 0, count: 0, buff: {} };
            var hit = s._ownerData.mmoSkillHitDict[target._id];
            hit.hurt += atkData.hurt;
            hit.heal += atkData.heal;
            ++hit.count;
            s.addMMOBuffByCfg(target, mmoSkillCfg.buff, s._ownerData, target.getCampFlag(s._id, s._camp), hit);
            var i, len;
            len = mmoSkillCfg.randBuff.length;
            if (len > 0) {
                for (i = 0; i < len; ++i)
                    s.addMMOBuffByCfg(target, mmoSkillCfg.randBuff[i], s._ownerData, target.getCampFlag(s._id, s._camp), hit, mmoSkillCfg.buffWeight[i]);
            }
            if (s._ownerData && s._ownerData.ownerIsValid()) {
                var boss = s._ownerData._owner;
                if (target._camp == 1 && boss._gameRoleSubType == ly.GameRoleSubType.ENTRY_BOSS && boss.cfg.dungeonId > 0 && !ly_editor.EditorType.isEditor(PlatData.editor)) {
                    var logic = s._scene.sceneLogic;
                    s._scene.hangupSmartPaused = true;
                    logic.runBattleEnter(boss.cfg.dungeonId);
                }
            }
            if (!doubleHit) {
                var isDouble = void 0;
                var double = void 0, tenaDouble = void 0;
                double = s._ownerData.getAttr(134) * s._doubleReduce;
                tenaDouble = target.getAttr(135);
                isDouble = ly.PublicVar.calMMOIsAffect(double, tenaDouble);
                if (isDouble) {
                    s._doubleReduce *= 0.75;
                    s.addMMOHitToTarget(target, index, atkIndex, hurtAdd, true);
                }
                else
                    s._doubleReduce = 1;
            }
            return true;
        };
        GameRole.prototype.addMMOBuffByCfg = function (target, buff, ownerData, camp, hit, buffWeight, isPassive) {
            if (camp === void 0) { camp = 1; }
            if (hit === void 0) { hit = null; }
            if (buffWeight === void 0) { buffWeight = NaN; }
            if (isPassive === void 0) { isPassive = false; }
            var s = this;
            var buffId;
            var campFlag;
            var i, len;
            var buffData;
            var randomBuff = buffWeight == buffWeight;
            if (buff == null || buff.length == 0)
                return;
            len = buff.length;
            for (i = 0; i < len; i += 3) {
                buffId = buff[i + 1];
                if (hit && hit.buff[buffId] == 1)
                    continue;
                campFlag = buff[i + 2] | 0;
                if (campFlag == 3)
                    campFlag = 4;
                if ((campFlag & camp) == 0)
                    continue;
                if (campFlag == 0 || s.getCampFlag(target._id, target._camp) == campFlag) {
                    if (ly.MMOBuffLogic.buffIsAllEffectCD(s, buffId))
                        continue;
                    buffData = s.addMMOBuffEffect(target, ownerData, buff, hit, i, buffWeight);
                    if (buffData) {
                        buffData.isPassive = isPassive;
                        if (randomBuff)
                            break;
                    }
                }
            }
        };
        GameRole.prototype.addMMOBuffEffect = function (target, ownerData, buff, hit, index, buffWeight) {
            if (hit === void 0) { hit = null; }
            if (index === void 0) { index = 0; }
            if (buffWeight === void 0) { buffWeight = NaN; }
            var rnd;
            var effectArr;
            var buffId;
            var s = this;
            if (hit && hit.buff[buffId] == 1)
                return null;
            buffWeight = buffWeight == buffWeight ? buffWeight : 1000;
            buffId = buff[index + 1];
            rnd = Math.random();
            if (rnd < buff[index + 0] / buffWeight) {
                var buffData = target.addMMOBuff(ly.Role.getRoleId(), buffId, ownerData);
                if (buffData) {
                    if (hit)
                        hit.buff[buffId] = 1;
                    effectArr = ly.Cfg_buff.ins.getMMOEffectByBuffId(buffId);
                    ly.MMOEffect.addEffect(target, ownerData, buffData, s._scene.timeTick, ly.EffectType.BUFF, effectArr);
                }
                return buffData;
            }
            return null;
        };
        GameRole.prototype.addMMOHitEffect = function (target, ownerData) {
            var s = this;
            if (ownerData._skillCfg.hitEffect && ownerData._skillCfg.hitEffect.length > 0)
                ly.MMOEffect.addEffect(target, s._ownerData, null, 0, ly.EffectType.SINGLE, ownerData._skillCfg.hitEffect);
        };
        GameRole.prototype.setMMODamage = function (damageSts, damageEffect, atkOwnerData, targetData) {
            if (damageSts === void 0) { damageSts = -1; }
            if (damageEffect === void 0) { damageEffect = null; }
            if (atkOwnerData === void 0) { atkOwnerData = null; }
            if (targetData === void 0) { targetData = null; }
            var s = this;
            s._lastMMODamageTime = s._scene.timeTick;
            if (damageSts > -1)
                s.setSts(damageSts);
            if (damageEffect)
                s.createMulEffect(damageEffect, ly.EffectType.SINGLE);
            if (ly.PublicVar.isResource(targetData.role._gameRoleSubType)) {
                s.setSts(ly.StsType.DAMAGE5);
            }
            if (atkOwnerData._skillCfg.hitSound)
                modules.n_sound.SoundCtrl.instance.playSoundByName(atkOwnerData._skillCfg.hitSound);
            s.checkMMOBuffAffect(ly.BuffAffectType.DAMAGE, atkOwnerData);
            if (targetData.hitType == 0)
                s.checkMMOBuffAffect(ly.BuffAffectType.DODGE, atkOwnerData);
            else if (targetData.hitType == 5)
                s.checkMMOBuffAffect(ly.BuffAffectType.BLOCK, atkOwnerData);
            else
                s.checkMMOBuffAffect(ly.BuffAffectType.HIT, atkOwnerData);
            atkOwnerData._skillCfg.enhanceSkills;
            s.checkMMOSpecBuffAffect(atkOwnerData);
            s.calMMODamage(atkOwnerData, targetData);
            targetData.clear();
        };
        GameRole.prototype.calMMODamage = function (atkOwnerData, targetData) {
            var s = this;
            var isCrit;
            var hpType;
            if (atkOwnerData == null || targetData == null)
                return;
            isCrit = targetData.hitType == 2;
            if (isCrit)
                s.checkMMOBuffAffect(ly.BuffAffectType.CRITICAL);
            var reduceMp = targetData.reduceMP;
            if (reduceMp == reduceMp) {
                s.addMp(s._mp - reduceMp, isCrit);
            }
            var reduceSP = targetData.reduceSP;
            if (reduceSP == reduceSP) {
                s.addSp(s._sp - reduceSP, isCrit);
            }
            if (targetData.hitType == 0) {
                s.addFlowNumber(ly.RoleID.MMO_HP_NUM, "躲闪", 0, 0, ly.HPNUM_TYPE.OTHER);
                return;
            }
            if (targetData.hitType == 5) {
                s.addFlowNumber(ly.RoleID.MMO_HP_NUM, "格挡", 0, 0, ly.HPNUM_TYPE.OTHER);
                return;
            }
            hpType = ly.HPNUM_TYPE.COMMON;
            if (targetData.realHurt != 0 || targetData.hurt != 0) {
                if (!atkOwnerData.isStoryCreate) {
                    s.addHurtRecord(atkOwnerData._id, targetData.realHurt, atkOwnerData._roleID);
                }
                var reduce = void 0, reduce2 = void 0;
                reduce2 = reduce = targetData.ignoreShield ? targetData.realHurt : ly.MMOBuffLogic.reduceShield(s, targetData.realHurt);
                if (reduce > 0 && s.buffValues[ly.BuffEType.LOCK_HP] > 0) {
                    if (s._hp - reduce < s.buffValues[ly.BuffEType.LOCK_HP]) {
                        reduce = s._hp - s.buffValues[ly.BuffEType.LOCK_HP];
                    }
                }
                s.addHp(-reduce - targetData.dmgRealHurt, isCrit, hpType, s._scene.isWorldBossDungeon(), -reduce - targetData.dmgRealHurt, -(targetData.realHurt - reduce2));
                if (s._lastHitTime != s._lastHitTime) {
                    s.setTint(s.hurtColor);
                    s._lastHitTime = s._scene.timeTick;
                }
            }
            if (targetData.heal > 0) {
                s.checkMMOBuffAffect(ly.BuffAffectType.HEAL);
                s.addHp(targetData.heal, isCrit, ly.HPNUM_TYPE.HEAL);
            }
            if (targetData.suck > 0 && atkOwnerData.ownerIsValid())
                atkOwnerData._owner.addHp(targetData.suck, false, ly.HPNUM_TYPE.SUCK);
            s.checkDead(atkOwnerData);
        };
        GameRole.prototype.checkDead = function (atkOwnerData, buffData, buffTypeData) {
            if (atkOwnerData === void 0) { atkOwnerData = null; }
            if (buffData === void 0) { buffData = null; }
            if (buffTypeData === void 0) { buffTypeData = null; }
            var s = this;
            if (s._hp <= 0 && !ly.StsType.cannotAction(s._sts)) {
                s._isDead = true;
                var hasReviveBuff = ly.MMOBuffLogic.hasBuffRevive(s);
                if (!hasReviveBuff)
                    s.battleDead(atkOwnerData, buffData, buffTypeData);
                s.checkMMOBuffAffect(ly.BuffAffectType.DYING, atkOwnerData);
                if (hasReviveBuff && s._isDead)
                    s.battleDead(atkOwnerData, buffData, buffTypeData);
                s.removeBuff(-1);
                if (s.isStoryCreate) {
                    if (s._gameRoleSubType == ly.GameRoleSubType.BOSS)
                        Socket.ins.send("TmCM", [s._scene._curDungeon.id, parseInt(s._roleID)]);
                }
            }
        };
        GameRole.prototype.battleDead = function (atkOwnerData, buffData, buffTypeData) {
            if (atkOwnerData === void 0) { atkOwnerData = null; }
            if (buffData === void 0) { buffData = null; }
            if (buffTypeData === void 0) { buffTypeData = null; }
            var s = this;
            s.setOperSts(s.canRevive ? ly.StsType.FALL : ly.StsType.DEATH);
            s._scene.sceneLogic.roleDead(s, atkOwnerData, buffData, buffTypeData);
            if (window["PF_INFO"]["console"]) {
                Log.writeLog("打印战斗数据，状态死亡" + " 角色id:" + s._roleID);
            }
        };
        GameRole.prototype.addHurtRecord = function (fId, hurt, roleID) {
            var p;
            var s = this;
            p = new ly.Pair();
            p.first = fId;
            p.second = hurt;
            s.hurtList[s.hurtList.length] = p;
            this.hurtMonsterId = roleID;
            if (this.hurtList.length > 100) {
                this.hurtList.shift();
            }
        };
        GameRole.prototype.setDirection = function (directSts) {
            var s = this;
            if (ly.MMOBuffLogic.hasBuffLimit(s))
                return;
            _super.prototype.setDirection.call(this, directSts);
            s.setActionInvert(s._direction);
        };
        GameRole.prototype.setActionInvert = function (dir) {
            var s = this;
            s._actionInvert = ly.DirectionType.isReserveDir(dir) ? 1 : -1;
            if (s._sts == ly.StsType.DAMAGE3)
                s._actionInvert *= -1;
        };
        GameRole.prototype.getBossRandomHP = function () {
            var s = this;
            return s._hp * (0.05 + 0.05 * Math.random()) | 0;
        };
        GameRole.prototype.getCampFlag = function (id, camp) {
            var s = this;
            if (s._ownerData)
                return ly.PublicVar.getCampFlag(s._ownerData._id, s._ownerData._camp, id, camp);
            return ly.PublicVar.getCampFlag(s._id, s._camp, id, camp);
        };
        GameRole.prototype.getCampFlagIndex = function (id, camp) {
            var s = this;
            if (s._ownerData)
                return ly.PublicVar.getCampFlagIndex(s._ownerData._id, s._ownerData._camp, id, camp);
            return ly.PublicVar.getCampFlagIndex(s._id, s._camp, id, camp);
        };
        GameRole.prototype.canAttack = function (role, checkCamp) {
            if (checkCamp === void 0) { checkCamp = -1; }
            var s = this;
            if (role == null)
                return false;
            if (role._inSafeArea || role.inAirPos || role._isDead || role.buffValues[ly.BuffEType.INVINCIBLE] > 0 || role.invincible || role._sts == ly.StsType.FALL)
                return false;
            if (checkCamp > -1 && (checkCamp & role.getCampFlag(s._id, s._camp)) == 0)
                return false;
            return !role.isDel() && !ly.StsType.cannotSelect(role._sts);
        };
        GameRole.prototype.setVisible = function (val) {
            var s = this;
            if (s._visible == val)
                return;
            _super.prototype.setVisible.call(this, val);
            s._lastNotVisibleTime = val ? NaN : s._scene.timeTick;
        };
        GameRole.prototype.enabledTouchMove = function (val) {
            var s = this;
            if (s._touchMoveEnabled == val)
                return;
            s._touchMoveEnabled = val;
            if (s._touchMoveEnabled) {
                s._skin.mouseEnabled = true;
                Laya.stage.on(Laya.Event.MOUSE_MOVE, s, s.touchMoveRole);
            }
            else {
                s._skin.mouseEnabled = s._selectabled;
                Laya.stage.off(Laya.Event.MOUSE_MOVE, s, s.touchMoveRole);
            }
        };
        GameRole.prototype.enabledSelect = function (val) {
            var s = this;
            if (s._selectabled == val)
                return;
            s._selectabled = val;
            if (s._selectabled) {
                s._skin.mouseEnabled = true;
                s._skin.on(Laya.Event.CLICK, s, s.selectedRole);
                s._skin.on(Laya.Event.MOUSE_DOWN, s, s.touchBeginRole);
                Laya.stage.on(Laya.Event.MOUSE_UP, s, s.touchEndRole);
                s._skin.name = s._absX + "," + s._absY;
                if (s._skin.hitArea == null) {
                    if (s._cfg.clkRect && s._cfg.clkRect.length > 0)
                        s._clkRect.setTo(s._cfg.clkRect[0], s._cfg.clkRect[1], s._cfg.clkRect[2], s._cfg.clkRect[3]);
                    else
                        s._clkRect.copyFrom(GameRole.Default_ClkRect);
                    s._skin.hitArea = s._clkRect;
                }
            }
            else {
                s._skin.mouseEnabled = false;
                s._skin.off(Laya.Event.CLICK, s, s.selectedRole);
                s._skin.off(Laya.Event.MOUSE_DOWN, s, s.touchBeginRole);
                Laya.stage.off(Laya.Event.MOUSE_UP, s, s.touchEndRole);
            }
        };
        Object.defineProperty(GameRole.prototype, "selectabled", {
            get: function () {
                var s = this;
                return s._selectabled;
            },
            enumerable: true,
            configurable: true
        });
        GameRole.prototype.setSelected = function (val) {
            var s = this;
            if (!s._selectabled)
                return;
            s._selected = val;
        };
        GameRole.prototype.getSelected = function () {
            return this._selected;
        };
        GameRole.prototype.touchBeginRole = function (e) {
            var s = this;
            s._isTouchBegin = true;
            s._scene.roleMouse(e.type, s);
        };
        GameRole.prototype.touchEndRole = function (e) {
            var s = this;
            s._isTouchBegin = false;
            s._scene.roleMouse(e.type, s);
        };
        GameRole.prototype.selectedRole = function (e) {
            var s = this;
            s._scene.roleMouse(e.type, s);
        };
        GameRole.prototype.touchMoveRole = function (e) {
            var s = this;
            if (s._isTouchBegin)
                s._scene.roleMouse(e.type, s);
        };
        GameRole.prototype.isSending = function () {
            return ly.StsType.isSending(this._sts);
        };
        GameRole.prototype.targetIsMyCamp = function (target) {
            var s = this;
            if (target == null)
                return false;
            return s.getCampFlag(target._id, target._camp) != 4;
        };
        GameRole.prototype.getHitType = function (hitedRole) {
            var s = this;
            var isCrit;
            var crit, tenacity;
            crit = s._ownerData.getAttr(123);
            tenacity = hitedRole.getAttr(124);
            isCrit = ly.PublicVar.calMMOIsAffect(crit, tenacity);
            if (isCrit) {
                return 2;
            }
            var isHit;
            var skillHit, hit, dodge;
            dodge = hitedRole.getAttr(126);
            hit = s._ownerData.getAttr(125);
            skillHit = (s._ownerData._skillCfg.skillNub[4] | 0) / 1000;
            if (skillHit == 0)
                skillHit = 1;
            isHit = ly.PublicVar.calMMOIsAffect(skillHit + hit, dodge);
            if (!isHit)
                return 0;
            if (hitedRole.buffValues[ly.BuffEType.BLOCK] > 0) {
                --hitedRole.buffValues[ly.BuffEType.BLOCK];
                ly.MMOBuffLogic.checkBuffKeepByType(hitedRole, ly.BuffEType.BLOCK);
                return 5;
            }
            return 1;
        };
        GameRole.prototype.calMMOHurt = function (hurtAdd, atkData, index) {
            var s = this;
            var target = atkData.role;
            if (target._gameRoleSubType == 3 || target._gameRoleSubType == 4 || target._gameRoleSubType == 7) {
                return atkData.realHurt = atkData.hurt = 1;
            }
            if (target.buffValues[ly.BuffEType.IMMUNITY_ATK] > 0 && atkData.skillCfg.isCommonAtk)
                return 0;
            if (target.buffValues[ly.BuffEType.IMMUNITY_SKILL] > 0 && atkData.skillCfg.isSkill)
                return 0;
            var atk = s._ownerData.getAttr(121);
            if (index == 2) {
                var power = void 0;
                var baseVal = void 0;
                var deff = target.getAttr(122);
                baseVal = atk - deff;
                var critAdd = 1;
                var isCrit = atkData.hitType == 2;
                var crit_deep = 0;
                var crit_less = 0;
                var dmgReal = void 0;
                if (isCrit) {
                    crit_deep = s._ownerData.getAttr(13);
                    crit_less = target.getAttr(14);
                    critAdd += Math.max(1 + crit_deep - crit_less, 1);
                }
                var dmg_real_add = void 0, dmg_real_reduce = void 0, dmg_real_deep = void 0, dmg_real_less = void 0, injury_real_add = void 0, injury_real_reduce = void 0, dmg_real = void 0, def_real = void 0;
                dmgReal = 0;
                dmg_real_add = s._ownerData.getAttr(141);
                dmg_real_reduce = target.getAttr(142);
                dmg_real_deep = s._ownerData.getAttr(145);
                dmg_real_less = s._ownerData.getAttr(146);
                injury_real_add = target.getAttr(151);
                injury_real_reduce = target.getAttr(152);
                dmg_real = s._ownerData.getAttr(42);
                def_real = target.getAttr(43);
                dmgReal = (dmg_real - def_real) * (1 + dmg_real_add - dmg_real_reduce + dmg_real_deep - dmg_real_less + injury_real_add - injury_real_reduce) * critAdd;
                if (dmgReal < 0)
                    dmgReal = 0;
                atkData.dmgRealHurt = dmgReal;
                var dmg_deep = s._ownerData.getAttr(15);
                var dmg_less = target.getAttr(16);
                var dmgAdd = 1 + dmg_deep + s._ownerData._enhanceValue - dmg_less;
                var dmg_pvp_deep = 0;
                var dmg_pvp_less = 0;
                if (s._scene._isMMOPvp) {
                    dmg_pvp_deep = s._ownerData.getAttr(17);
                    dmg_pvp_less = target.getAttr(18);
                    dmgAdd += dmg_pvp_deep - dmg_pvp_less;
                }
                var randomNum = 0.85 + Math.random() * 0.3;
                var hurt = void 0;
                power = baseVal * hurtAdd * randomNum * dmgAdd * critAdd;
                if (power < 1)
                    power = 1;
                if (s._ownerData._buffValues[ly.BuffEType.KILL] > 0 && target._hp / target._hpMax <= s._ownerData._buffValues[ly.BuffEType.KILL])
                    hurt = target._hp;
                else
                    hurt = Math.ceil(power * (1 - target.buffValues[ly.BuffEType.UNHURT] + target.buffValues[ly.BuffEType.ADDHURT]));
                atkData.realHurt = atkData.hurt = hurt;
                if (s._ownerData._buffValues[ly.BuffEType.ABSORB_HP] > 0)
                    atkData.suck = hurt * s._ownerData._buffValues[ly.BuffEType.ABSORB_HP];
                if (window["PF_INFO"]["console"]) {
                    if (s._scene._isMMOPvp) {
                        Log.writeLog("打印战斗数据------------->\n	伤害:" + (hurt + dmgReal) + "，真伤：" + dmgReal + "，技能真伤:" + (atkData.ignoreShield ? hurt : 0) + " 攻击方id:" + atkData.fId + " 防御方id:" + target._roleID + " 技能id:" + atkData.skillID + " 是否暴击:" + (isCrit ? "true" : "false")
                            + " 随机数:" + randomNum + "\n伤害公式:" + ("\u6700\u7EC8\u4F24\u5BB3=max((" + atk + "-" + deff + ")*" + hurtAdd + "*rand(0.85,1.15)*(1+" + dmg_deep + "-" + dmg_less + "+" + dmg_pvp_deep + "-" + dmg_pvp_less + ")\n\t\t\t\t\t\t*(1+if(\u4E0D\u66B4\u51FB=0,\u66B4\u51FB\u65F6=max((1+" + crit_deep + "-" + crit_less + ")\uFF0C1)))\n\t\t\t\t\t\t+ max((" + dmg_real + "-" + def_real + ")*(1+" + dmg_real_add + "-" + dmg_real_reduce + " + " + dmg_real_deep + "-" + dmg_real_less + " + " + injury_real_add + "-" + injury_real_reduce + ")*(1+if(\u4E0D\u66B4\u51FB=0,\u66B4\u51FB\u65F6=max((1+" + crit_deep + "-" + crit_less + ")\uFF0C1))),0)")
                            + "\nbuff免伤:" + target.buffValues[ly.BuffEType.UNHURT] + "\nbuff增伤:" + target.buffValues[ly.BuffEType.ADDHURT] + "\nbuff技能强化:" + s._ownerData._enhanceValue);
                    }
                    else {
                        Log.writeLog("打印战斗数据------------->\n	伤害:" + (hurt + dmgReal) + "，真伤：" + dmgReal + "，技能真伤:" + (atkData.ignoreShield ? hurt : 0) + " 攻击方id:" + atkData.fId + " 防御方id:" + target._roleID + " 技能id:" + atkData.skillID + " 是否暴击:" + (isCrit ? "true" : "false")
                            + " 随机数:" + randomNum + "\n伤害公式:" + ("\u6700\u7EC8\u4F24\u5BB3=max((" + atk + "-" + deff + ")*" + hurtAdd + "*rand(0.85,1.15)*(1+" + dmg_deep + "-" + dmg_less + ")\n\t\t\t\t\t\t*(1+if(\u4E0D\u66B4\u51FB=0,\u66B4\u51FB\u65F6=max((1+" + crit_deep + "-" + crit_less + ")\uFF0C1))),1)\n\t\t\t\t\t\t+ max((" + dmg_real + "-" + def_real + ")*(1+" + dmg_real_add + "-" + dmg_real_reduce + " + " + dmg_real_deep + "-" + dmg_real_less + " + " + injury_real_add + "-" + injury_real_reduce + ")*(1+if(\u4E0D\u66B4\u51FB=0,\u66B4\u51FB\u65F6=max((1+" + crit_deep + "-" + crit_less + ")\uFF0C1))),0)")
                            + "\nbuff免伤:" + target.buffValues[ly.BuffEType.UNHURT] + "\nbuff增伤:" + target.buffValues[ly.BuffEType.ADDHURT] + "\nbuff技能强化:" + s._ownerData._enhanceValue);
                    }
                }
            }
            else {
                var cure = s._ownerData.getAttr(8);
                atkData.heal = Math.ceil(atk * hurtAdd + cure);
                if (window["PF_INFO"]["console"]) {
                    Log.writeLog("打印战斗数据，治疗:" + atkData.heal + " 攻击方id:" + atkData.fId + " 防御方id:" + target._roleID + " 技能id:" + atkData.skillID + "\n治疗公式:" + ("\u6CBB\u7597\u91CF=" + atk + "*" + hurtAdd + "+" + cure));
                }
            }
            if (window["PF_INFO"]["console"]) {
                var printStr = void 0;
                var atkAttrStr = this.getAttrStr(s._ownerData._typesAttr);
                var defAttrStr = this.getAttrStr(target._typesAttr);
                printStr = "打印战斗数据------------->\n属性攻击方:" + atkAttrStr + "\n";
                printStr += "	属性防御方:" + defAttrStr + "\n";
                atkAttrStr = this.getAttrStr(s._buffTypesAttr);
                defAttrStr = this.getAttrStr(target._buffTypesAttr);
                printStr += "	buff叠加属性攻击方:" + atkAttrStr + "\n";
                printStr += "	buff叠加属性防御方:" + defAttrStr + "\n";
                printStr += "	当前的buff生效效果攻击方:" + ly.MMOBuffLogic.printBuffAffect(s) + "\n";
                printStr += "	当前的buff生效效果防御方:" + ly.MMOBuffLogic.printBuffAffect(target) + "\n";
                Log.writeLog(printStr);
            }
            return atkData.realHurt;
        };
        GameRole.prototype.getAttrStr = function (typesAttr) {
            var str = "";
            for (var k in typesAttr) {
                var id = parseInt(k);
                var val = typesAttr[k];
                str += ly.AttrItmDefineCfg.ins.getAttrStr(id, val) + "，";
            }
            return str;
        };
        GameRole.prototype.skillCanAtk = function (skillType, gameRoleSubType) {
            var s = this;
            if (skillType == -1)
                return true;
            if (gameRoleSubType == 3)
                return skillType == 3;
            if (gameRoleSubType == 4)
                return skillType == 4;
            return skillType < 3;
        };
        GameRole.prototype.buffAttacking = function () {
            var s = this;
            var i, len, index, ind, rateLen, end;
            var rateRange;
            var flag;
            var r;
            var atkIndices;
            var rateCfg;
            if (s._ownerData == null)
                return;
            rateCfg = s.getRateCfg(s._sts, s._direction);
            atkIndices = s.getAtkIndices(s._sts, s._direction, rateCfg);
            if (atkIndices == null || atkIndices.length == 0)
                return;
            rateLen = s._skinPart._rateLen;
            if (rateLen < s.getAtkRangeMaxIndex(s._sts, s._direction, rateCfg))
                end = s._skinPart._loopsCount * rateLen + s._skinPart.curRate + 1;
            else {
                end = s._skinPart.curRate + 1;
                if (s._skinPart.loops == s._skinPart.loops && len > s._skinPart._rateLen)
                    end = s._skinPart._rateLen;
            }
            i = s._attackFrameIndex;
            atkIndices = s.getAtkIndicesByFrame(i, end, false, rateCfg);
            if (atkIndices == null) {
                s._attackFrameIndex = end;
                return false;
            }
            len = atkIndices.length;
            for (i = 0; i < len; ++i) {
                ind = atkIndices[i];
                r = s._owner;
                if (r._isDead)
                    break;
                rateRange = s.getAttackRange(s._sts, ind);
                if (rateRange) {
                    index = r.getCampFlagIndex(s._ownerData._id, s._ownerData._camp);
                    flag = s.addMMOHitToTarget(r, index, 0, s.hurtAdd) || flag;
                }
            }
            s._attackFrameIndex = end;
            return flag;
        };
        GameRole.prototype.hitEffectAttacking = function () {
            var s = this;
            var i, len, index, ind, end, rateLen;
            var rateRange;
            var flag;
            var r;
            var atkIndices;
            var rateCfg;
            if (s._ownerData == null)
                return;
            rateCfg = s.getRateCfg(s._sts, s._direction);
            end = s._skinPart.curRate + 1;
            rateLen = s._skinPart._rateLen;
            if (s._skinPart.loops == s._skinPart.loops && len > rateLen)
                end = rateLen;
            i = s._attackFrameIndex;
            atkIndices = s.getAtkIndicesByFrame(i, end, true, rateCfg);
            if (atkIndices == null) {
                s._attackFrameIndex = end;
                return false;
            }
            len = atkIndices.length;
            for (i = 0; i < len; ++i) {
                ind = atkIndices[i];
                r = s._owner;
                if (r._isDead)
                    break;
                rateRange = s.getAttackRange(s._sts, ind);
                if (rateRange) {
                    index = s._owner.getCampFlagIndex(s._ownerData._id, s._ownerData._camp);
                    flag = s.addMMOHitToTarget(s._owner, index) || flag;
                }
            }
            s._attackFrameIndex = end;
            return flag;
        };
        GameRole.prototype.attacking = function () {
            var s = this;
            if (s._skinPart == null)
                return;
            if (s._ownerData == null)
                return;
            var i, len, j, len2, ind, end, rateLen;
            var lockRange, bodyRange, range, atkIndices;
            var enemies;
            var r;
            var atkIndex;
            var rateRange;
            var flag;
            var countArr;
            var campFlag = 0;
            var count, absX, absY, ox, oy;
            var o;
            var mmoSkillCfg;
            var aRange;
            var rateCfg;
            rateCfg = s.getRateCfg(s._sts, s._direction);
            end = s._skinPart.curRate + 1;
            rateLen = s._skinPart._rateLen;
            if (s._skinPart.loops == s._skinPart.loops && len > rateLen)
                end = rateLen;
            i = s._attackFrameIndex;
            atkIndices = s.getAtkIndicesByFrame(i, end, false, rateCfg);
            if (atkIndices == null) {
                s._attackFrameIndex = end;
                return false;
            }
            o = s.getOwner();
            mmoSkillCfg = s._ownerData._skillCfg;
            campFlag = mmoSkillCfg.campFlag;
            aRange = [];
            countArr = [];
            if (mmoSkillCfg.type == 1) {
                lockRange = s.getLockAtkRange(s._sts);
                atkIndex = 0;
            }
            if (s._layerType >= ly.LayerType.ROLE_BACK) {
                absX = o._absX;
                absY = o._absY;
            }
            else {
                absX = s._absX;
                absY = s._absY;
            }
            var isRoleLayer = !s.isSceneLayer();
            ox = (isRoleLayer ? s.skin.x : 0);
            oy = (isRoleLayer ? s.skin.y : 0);
            len = atkIndices.length;
            for (i = 0; i < len; ++i) {
                ind = atkIndices[i];
                rateRange = s.getAttackRange(s._sts, ind);
                if (rateRange && (rateRange.range || lockRange)) {
                    countArr.length = 0;
                    len2 = mmoSkillCfg.skillTarget.length;
                    for (j = 0; j < len2; ++j) {
                        count = mmoSkillCfg.skillTarget[j][1];
                        countArr[mmoSkillCfg.skillTarget[j][0] - 1] = count == 0 ? 999999 : count;
                    }
                    range = lockRange ? lockRange : rateRange.range;
                    var m = void 0;
                    var agl = void 0;
                    aRange.length = 0;
                    if (s._autoRotate) {
                        agl = s._autoRotationNotInvert * ly.MathUtil.DEG_TO_RAD;
                        m = Laya.Matrix.create();
                        m.rotate(agl);
                        len2 = range.length;
                        for (j = 0; j < len2; j += 2) {
                            aRange[j] = absX + m.a * range[j] + m.c * range[j + 1];
                            aRange[j + 1] = absY + m.d * range[j + 1] + m.b * range[j];
                        }
                    }
                    else {
                        len2 = range.length;
                        for (j = 0; j < len2; j += 2) {
                            aRange[j] = ox + absX + (s._dirScaleX > 0 ? -range[j] : range[j]) | 0;
                            aRange[j + 1] = oy + absY + (range[j + 1] | 0);
                        }
                    }
                    if (ly.RoleSkin.debugAtk) {
                        if (s._autoRotate) {
                            s.skin.debugAtkRange = range;
                            s.skin.debugAtkOffX = 0;
                            s.skin.debugAtkOffY = 0;
                        }
                        else {
                            s.skin.debugAtkRange = aRange;
                            s.skin.debugAtkOffX = -absX - ox;
                            s.skin.debugAtkOffY = -absY - oy;
                        }
                        s.skin.debugAtkRangeTime = s._scene.timeTick;
                    }
                    atkIndex = rateRange.index;
                    if (enemies == null) {
                        enemies = s.getEnemyList(campFlag, false, ly.PeakType.NONE, s._ownerData._skillData, null, ly.MathUtil.calMaxRect(aRange));
                        if (s._ownerData._targetId > 0) {
                            var tempRole = void 0;
                            var eInd = -1;
                            len2 = enemies.length;
                            while (--len2 > -1) {
                                if (enemies[len2]._id == s._ownerData._targetId)
                                    eInd = len2;
                            }
                            if (eInd > 0) {
                                tempRole = enemies[eInd];
                                enemies[eInd] = enemies[0];
                                enemies[0] = tempRole;
                            }
                        }
                    }
                    len2 = enemies.length;
                    for (j = 0; j < len2; ++j) {
                        r = enemies[j];
                        if (r == o)
                            ind = 0;
                        else if (r._camp == s._camp)
                            ind = 1;
                        else
                            ind = 2;
                        if (countArr[ind] > 0) {
                            bodyRange = r.getBodyRange(r._direction);
                            if (ly.PositionUtil.isShapeInsert(aRange, bodyRange)) {
                                --countArr[ind];
                                if (lockRange)
                                    flag = s.addMMOLockHitToTarget(r, mmoSkillCfg) || flag;
                                else
                                    flag = s.addMMOHitToTarget(r, ind, atkIndex) || flag;
                                if (r._isDead && mmoSkillCfg.cdPro > 0 && o._skillCDList[mmoSkillCfg.skillId] > 0) {
                                    o._skillCDList[mmoSkillCfg.skillId] -= mmoSkillCfg.cdPro;
                                }
                            }
                            else
                                s.ai_debugger && s.ai_debugger.addAtkData(s._scene.timeTick, ly.AIAttackResult.NotInRange, r, mmoSkillCfg.skillId, r._clothesRate.hitRange, aRange);
                        }
                        else
                            s.ai_debugger && s.ai_debugger.addAtkData(s._scene.timeTick, ly.AIAttackResult.NotEnough, r, mmoSkillCfg.skillId);
                    }
                }
            }
            s._attackFrameIndex = end;
            return flag;
        };
        GameRole.prototype.inExactRange = function (range) {
            if (range)
                return true;
            var s = this;
            ly.PositionUtil.isPointInShape(s._absX, s._absY, range);
            return false;
        };
        GameRole.prototype.inSafeArea = function () {
            return this._inSafeArea;
        };
        GameRole.prototype.outArea = function () {
            var s = this;
            s._scene.sceneLogic.outArea(s, s.areaCol, s.areaRow);
            s._scene.sceneLogic.outPos(s);
        };
        GameRole.prototype.resetSts = function () {
            _super.prototype.resetSts.call(this);
            this.resetingSts();
        };
        GameRole.prototype.resetingSts = function () {
            var s = this;
            var atk, damageEnd;
            if (s._stsChangeBeforeReset)
                return;
            if (s._scene._isMMO) {
                if (s._sts == ly.StsType.SEND_OUT) {
                    return;
                }
                if (s._sts == ly.StsType.SEND_IN && !s.isMyPlayer && !s.isLeaderRole) {
                    s.moveToFollowPos();
                    return;
                }
                if (s._sts == ly.StsType.DEATH || s._sts == ly.StsType.FALL) {
                    if (!s._canRevive)
                        s.del();
                    return;
                }
                if (s._sts == ly.StsType.WARN) {
                    if (s._warnSkillLoopTime <= 0) {
                        GlobalData.notify.event(5065);
                        s.operMMOSkill(s._tmpSkill);
                    }
                    else {
                        s.setSts(ly.StsType.WARN_LOOP);
                    }
                    return;
                }
                if (s._sts == ly.StsType.WARN_LOOP) {
                    GlobalData.notify.event(5065);
                    s.operMMOSkill(s._tmpSkill);
                    return;
                }
                if (!ly.StsType.cannotAction(s._sts))
                    s.setSts(s._scene.getSceneStandSts());
                return;
            }
            damageEnd = ly.StsType.isDamageEndSts(s._sts);
            if (s._sts == ly.StsType.DEATH) {
                s.del();
            }
            else if ((s._sts == ly.StsType.DAMAGE || s._sts == ly.StsType.DAMAGE3) && s._isDead && s.canRevive) {
                s.setOperSts(ly.StsType.FALL);
            }
            else if (damageEnd && s.isProtect) {
                if (!s.moveBack()) {
                    if (!ly.StsType.cannotAction(s._sts))
                        s.setSts(s._scene.getSceneStandSts(), s._direction);
                }
                s.isProtect = false;
            }
            else if (s._sts == ly.StsType.DAMAGE2) {
                if (s._isDead && !s.canRevive) {
                    if (s.hitBackTimeTicker.getPercent() >= 1) {
                        if (s.pos > 0) {
                            s.moveToDel();
                        }
                        else
                            s.del();
                    }
                    else
                        return;
                }
                else {
                    if (s.hitBackTimeTicker.getPercent() >= 1)
                        s.setSts(ly.StsType.DAMAGE3, s._direction, s._actionCfg);
                    else
                        return;
                }
            }
            else {
                s.hitBackTimeTicker.clear();
                atk = ly.StsType.attackAction(s._sts);
                if (atk && s.skillCfg) {
                    s.attackEndCheck();
                }
                if ((atk || damageEnd || s._sts == ly.StsType.DODGE) && !s.hasNextTarget() && !s.hasNextCountRole()) {
                    if (!s.moveBack()) {
                        if (!ly.StsType.cannotAction(s._sts))
                            s.setSts(s._scene.getSceneStandSts(), s._direction);
                    }
                }
                else {
                    if (!s._targetMove && !ly.StsType.cannotAction(s._sts))
                        s.setSts(s._scene.getSceneStandSts(), s._direction);
                }
            }
        };
        GameRole.prototype.moveTo = function (abX, abY, callBack, thisObj, sts, time, rotateMove, dir, endSts, checkSts, floatH) {
            if (callBack === void 0) { callBack = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (sts === void 0) { sts = ly.StsType.MOVE; }
            if (time === void 0) { time = 180; }
            if (rotateMove === void 0) { rotateMove = false; }
            if (dir === void 0) { dir = -1; }
            if (endSts === void 0) { endSts = -1; }
            if (checkSts === void 0) { checkSts = true; }
            if (floatH === void 0) { floatH = NaN; }
            var s = this;
            if (s.isDel())
                return;
            if (checkSts && s._isDead)
                return;
            var agl, disX, disY;
            s._dirMove = false;
            disX = abX - s._absX;
            disY = abY - s._absY;
            if (sts > -1) {
                if (dir == -1) {
                    agl = Math.atan2(disY, disX);
                    dir = ly.DirectionType.getDirectorSts(agl);
                }
                s.setSts(sts, dir);
            }
            s.moveFlagSet(true, rotateMove);
            disX = Math.pow(disX * disX + disY * disY, 0.5);
            s._moveTimeTicker.init(s._scene.timeTick, time);
            s._speedX = s._speedY = 0;
            s._targetX = abX;
            s._targetY = abY;
            s._targetH = floatH;
            s._hasTargetPos = s._targetX == s._targetX || s._targetY == s._targetY || s._targetH == s._targetH;
            s._moveEndCall = callBack;
            s._moveEndObj = thisObj;
            s._moveEndSts = endSts == -1 ? s._scene.getSceneStandSts() : endSts;
        };
        GameRole.prototype.followTarget = function (tarRole, callBack, thisObj, sts) {
            if (callBack === void 0) { callBack = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (sts === void 0) { sts = ly.StsType.RUN; }
            var s = this;
            if (s.isDel())
                return;
            s.moveFlagSet(true, false);
            if (sts > -1) {
                s.setSts(sts, s._direction);
            }
            s._targetX = s._absX - tarRole._absX;
            s._targetY = s._absY - tarRole._absY;
            s._hasTargetPos = true;
            s._followTarget = tarRole;
            s._moveEndCall = callBack;
            s._moveEndObj = thisObj;
        };
        GameRole.prototype.enterLoop = function (t, index) {
            var s = this;
            var leader;
            var pt;
            if (s._scene._isMMO && s.pos > -1) {
                leader = s._scene.getLeaderRole();
                pt = s.getFollowPos(leader._absX, leader._absY);
                var followSet = s._followPosX != s._followPosX;
                s._followPosX = pt.x;
                s._followPosY = pt.y;
                if (followSet)
                    s._findEnemyRect = s.getFindEnemyRect(s._findEnemyRect);
            }
            _super.prototype.enterLoop.call(this, t, index);
            if (!s._scene._editabled && s._smartFunc != null && !ly.StsType.isDeadSts(s._sts))
                s._smartFunc.call(s, t);
        };
        GameRole.prototype.exitLoop = function (t, index) {
            var s = this;
            _super.prototype.exitLoop.call(this, t, index);
            s.attriCall();
            s.numberLoop(t);
            if (s._sts >= ly.StsType.ATTACK)
                s.attacking();
            if (s._scene.minSec100LoopIn)
                s.minSecondLoop(t);
            if (s._scene.secLoopIn) {
                s.secondLoop(t);
                s.visibleDelCheck();
            }
        };
        GameRole.prototype.secondLoop = function (t) {
        };
        GameRole.prototype.minSecondLoop = function (t) {
            var s = this;
            if (t - s._lastHitTime > 100) {
                s.setTint(ly.TintColor.DEFAULT);
                s._lastHitTime = NaN;
            }
            if (t >= s._closeCmdTipTime)
                s.setPlayerCmdTip(null);
        };
        GameRole.prototype.visibleDelCheck = function () {
            var s = this;
            if (!s._visible && s.visibleDelInterval == s.visibleDelInterval && s.areaKey) {
                if (s._scene.timeTick - s._lastNotVisibleTime > s.visibleDelInterval) {
                    if (s._scene.areaMgr.areaIsState(s.areaKey, ly.AreaState.NONE))
                        s.del();
                }
            }
        };
        GameRole.prototype.attriCall = function () {
            var s = this;
            ly.AttriCall.call(s, s._attriCallFlag);
            s._attriCallFlag = 0;
        };
        GameRole.prototype.del = function () {
            _super.prototype.del.call(this);
            var s = this;
            s.setHpBar(null);
            s.setName(null);
        };
        GameRole.prototype.showEspecChange = function (arr) {
            var s = this;
            var len;
            len = arr.length;
            for (var i = 3; i < len; i++) {
                if (i == 3) {
                    var model = ly.ModelCfg.ins.getModelUrl(arr[i]);
                    var modelArr = void 0;
                    modelArr = model.split("_");
                    s.addAttach(ly.SlotKey.findAttachByType(i), Number(modelArr[modelArr.length - 1]), true);
                }
                else
                    s.addAttach(ly.SlotKey.findAttachByType(i), arr[i], true);
            }
        };
        GameRole.prototype.clearQuadTrees = function () {
            var len;
            var s = this;
            len = s.quadTrees.length;
            if (len > 0) {
                while (--len > -1)
                    s.quadTrees[len].remove(s.quadTreeIndices[len]);
                s.quadTrees.length = s.quadTreeIndices.length = 0;
            }
        };
        GameRole.prototype.removeQuadTree = function (qt) {
            var quadTreeInd, last, displayInd;
            var quadTrees;
            var quadTreeIndices;
            var s = this;
            quadTrees = s.quadTrees;
            quadTreeInd = quadTrees.indexOf(qt);
            if (quadTreeInd == -1)
                return;
            quadTreeIndices = s.quadTreeIndices;
            displayInd = quadTreeIndices[quadTreeInd];
            last = quadTrees.length - 1;
            if (last > -1) {
                quadTrees[quadTreeInd] = quadTrees[last];
                quadTreeIndices[quadTreeInd] = quadTreeIndices[last];
                quadTreeIndices.length = quadTrees.length = last;
            }
            else {
                quadTreeIndices.length = quadTrees.length = 0;
            }
            qt.remove(displayInd);
        };
        GameRole.prototype.getQuadTreeRoles = function () {
            var s = this;
            if (s.quadTrees[0]) {
                var i = void 0, len = void 0, len2 = void 0;
                var arr = [];
                len = s.quadTrees.length;
                if (len > 0) {
                    var arr2 = void 0;
                    for (i = 0; i < len; ++i) {
                        arr2 = s.quadTrees[i].getDisplays();
                        len2 = arr2.length;
                        while (--len2 > -1) {
                            if (arr2[len2].tempMark)
                                continue;
                            arr2[len2].tempMark = true;
                            arr[arr.length] = arr2[len2];
                        }
                    }
                    len2 = arr.length;
                    while (--len2 > -1)
                        arr[len2].tempMark = false;
                }
                return arr;
            }
            return [];
        };
        GameRole.prototype.beforeToPool = function () {
            var s = this;
            s.roleBarrierSet(null, -1);
            _super.prototype.beforeToPool.call(this);
            s._smartName = s._callMonsterDict = s.areaKey = s._smartFunc = null;
            if (s._targetRoles)
                s._targetRoles.length = 0;
            s._bodyRange.length = 0;
            s._countAtkTarget = s._lockTarget = null;
            s._isLimit = s.storyEndStay = s.isStoryCreate = false;
            s.isLeaderRole = s._canRevive = false;
            s.canPatrol = s.isMyPlayer = s.isMyPet = s.isMyPartner = false;
            s.removeReviveCountDown();
            s.enabledSelect(false);
            s.enabledTouchMove(false);
            s._damageMp = false;
            s.clearAllBuff();
            s.clearCMDTip();
            s.enableHistoryRoute(false);
            if (s._skillList)
                s._skillList.length = 0;
            if (s._myRoundObjs)
                s._myRoundObjs.length = 0;
            s._mmoTargetRoles = s._mmoTargetIds = s.hurtList = s.hurtMonsterId = null;
            s._targetAngle = null;
            s._moveStopRole = null;
            s._followTarget = null;
            s._buffAtkEffect = s.guardian = null;
            s._targetDirection = ly.DirectionType.NONE;
            s.isProtect = s.isDefend = s.ignoreMoveStopRole = false;
            s._inMMOResourceState = s._inMMOBattleState = false;
            s.outArea();
            s.setHpBar(null);
            s.setName(null);
            s.setCid(null);
            s.setLevel(null);
            s.delTip();
            s.removeNumber();
            s.clearEffect();
            s.clearEffectData();
            s.resetTargetData();
            s._campObj = null;
            s._skillUseDict = null;
            s._leader = null;
            s.pos = s._leaderId = -1;
            s._typesAttr = null;
            s._transferX = s._transferY = NaN;
            s._transerOutCallBack = null;
            s._transerInCallBack = null;
            s._ownerData = null;
            s.invincible = false;
            s._effectDict = null;
            if (s._tmpSkill) {
                GlobalData.notify.event(5065);
            }
            s._tmpSkill = null;
            s._warnSkillLoopTime = null;
            s._warnSkillPos = null;
            s._historyRoute = s._followHistoryRoute = null;
            s.hateList = s._viewAtkList = s._viewList = null;
            s.clearQuadTrees();
            s._showEnter = false;
            s.hideFuncBtn();
        };
        GameRole.prototype.outPoolInit = function () {
            _super.prototype.outPoolInit.call(this);
            var s = this;
            s._doubleReduce = 1;
            s._lastFlowNumTime = s._attriCallFlag = s.funcType = 0;
            s.param = null;
            s._buffAffectTime = {};
            s._viewList = [];
            s._viewAtkList = [];
            s.tempMark = s._inSafeArea = false;
            s._followPosX = s._followPosY = NaN;
            s.functionBuildingName = null;
            s._lastMMODamageTime = NaN;
            s._lastHitTime = NaN;
            s._mountId = s._new_behavior = -1;
            s.transferDis = ly.PublicVar.transferDis;
            s.inRangeFlag = 1;
            s.eventId = 0;
            s.bornCD = 10;
            s.hangFollowDis = 100;
            s._sp = 0;
            s._spMax = 5;
            s._storyId = -1;
            s.areaCol = s.areaRow = NaN;
            s.visibleDelInterval = s._closeCmdTipTime = NaN;
            s._skillUseDict = {};
            s._buffTypesAttr = {};
            s._effectDict = {};
            s.callRound = -1;
            s._shieldHp = 0;
            s.rotateMove = false;
            s._selected = false;
            s._owner = s;
            s._campObj = ly.SceneConfig.defaultCampObj;
            s._lastOperTime = NaN;
            s.hitTime = NaN;
            s.effectCallBack = null;
            s.quadTreeIndices = [];
            s.quadTrees = [];
            s.hurtList = [];
            s.hurtMonsterId = null;
            s._mmoTargetRoles = [];
            s._mmoTargetIds = [];
            s.hasResourceInRange = false;
            s.setHasEnemyInRange(false);
            if (s._attackTimeTicker) {
                s._attackTimeTicker.clear();
                s._hitTimeTicker.clear();
                s.hitBackTimeTicker.clear();
                s.numShowTimeTicker.clear();
            }
        };
        GameRole.prototype.setHasEnemyInRange = function (inRange) {
            var s = this;
            s._hasEnemyInRange = inRange;
            if (inRange && s._camp == 1 && s._scene._isMMO) {
                var logic = s._scene.sceneLogic;
                logic.beAtkTime = null;
            }
        };
        GameRole.prototype.getHasEnemyInRange = function () {
            return this._hasEnemyInRange;
        };
        GameRole.prototype.scaleForDir = function () {
            var s = this;
            _super.prototype.scaleForDir.call(this);
            if (s._skinType == ly.SkinType.SPINE) {
                var scale = s._scene.sceneRoleScale;
                s._dirScaleX *= scale;
                s._dirScaleY *= scale;
            }
        };
        GameRole.prototype.moveSmart = function () {
            var s = this;
            var per;
            if (!s._targetMove)
                return;
            if (s._followTarget) {
                s._absX = s._followTarget._absX + s._targetX;
                s._absY = s._followTarget._absY + s._targetY;
                if (s._targetMove)
                    s.inArea();
                if (!s._followTarget._hasTargetPos) {
                    s._hasTargetPos = false;
                    s._followTarget = null;
                    s.moveSmartEnd();
                }
                return;
            }
            var ox, oy;
            ox = s._absX;
            oy = s._absY;
            s._moveTimeTicker.playRateUpdate();
            per = s._moveTimeTicker.getPercent();
            if (per >= 1) {
                s._absX = s._targetX;
                s._absY = s._targetY;
                if (s._targetH == s._targetH)
                    s._floatH = s._targetH;
                s._hasTargetPos = false;
                s._targetH = s._targetX = s._targetY = NaN;
                s.moveSmartEnd();
            }
            else {
                s._absX -= s._speedX;
                s._absY -= s._speedY;
                s._speedX = (s._targetX - s._absX) * per;
                s._speedY = (s._targetY - s._absY) * per;
                s._absX += s._speedX;
                s._absY += s._speedY;
                if (s._targetH == s._targetH) {
                    s._floatH -= s._speedH;
                    s._speedH = (s._targetH - s._floatH) * per;
                    s._floatH += s._speedH;
                }
            }
            if (s._autoRotate) {
                s.calAutoRotation(ox, oy, s._absX, s._absY);
            }
            if (s.rotateMove) {
                var pt = ly.PositionUtil.rotationXY(0, s._headH >> 1, s._skin.rotation * ly.MathConst.ROTATION_ANGLE);
                s._skin.x -= s._rotateXOffset;
                s._skin.y -= s._rotateYOffset;
                s._rotateXOffset = -pt.x;
                s._rotateYOffset = -pt.y;
                s._skin.x += s._rotateXOffset;
                s._skin.y += s._rotateYOffset;
                s._skin.rotation += 30;
            }
            if (s._targetMove)
                s.inArea();
        };
        GameRole.prototype.setSp = function (val, max) {
            if (max === void 0) { max = NaN; }
            var s = this;
            if (max == max) {
                if (s._spMax != val) {
                    s._spMax = max;
                    GlobalData.notify.event(7134, this._id);
                    s._attriCallFlag |= ly.AttriCallType.SPMAX;
                }
            }
            val = Math.min(s._spMax, val);
            if (s._sp != val) {
                s._sp = val;
                if (s.hpEffect) {
                    s.hpEffect.setSpTxt(s._sp, s._spMax);
                }
                GlobalData.notify.event(7133, this._id);
                s._attriCallFlag |= ly.AttriCallType.SP;
            }
        };
        GameRole.prototype.setMp = function (val, max) {
            if (max === void 0) { max = NaN; }
            var s = this;
            var mod = modules.n_player.PlayerMod.instance;
            if (max == max) {
                if (s._mpMax != val) {
                    s._mpMax = max;
                    if (s.isMyPlayer) {
                        mod.mp = s._mp || 0;
                        mod.maxMp = s._mpMax || 0;
                        s._attriCallFlag |= ly.AttriCallType.MPMAX;
                    }
                }
            }
            val = Math.min(s._mpMax, val);
            if (s._mp != val) {
                s._mp = val;
                if (s.isMyPlayer) {
                    mod.mp = s._mp || 0;
                    mod.maxMp = s._mpMax || 0;
                }
                s._attriCallFlag |= ly.AttriCallType.MP;
            }
        };
        GameRole.prototype.addSp = function (addSp, isCritical) {
            if (isCritical === void 0) { isCritical = false; }
            var s = this;
            s.setSp(s._sp + addSp);
        };
        GameRole.prototype.addMp = function (addMp, isCritical) {
            if (isCritical === void 0) { isCritical = false; }
            var s = this;
            s.setMp(s._mp + addMp);
        };
        GameRole.prototype.addShieldHp = function (shieldHp) {
            var s = this;
            s.addHp(0, false, ly.HPNUM_TYPE.COMMON, s._scene.isWorldBossDungeon(), 0, shieldHp);
        };
        GameRole.prototype.addHp = function (addHp, isCritical, hpType, boss, flowNum, shield) {
            if (isCritical === void 0) { isCritical = false; }
            if (hpType === void 0) { hpType = ly.HPNUM_TYPE.COMMON; }
            if (boss === void 0) { boss = false; }
            if (flowNum === void 0) { flowNum = NaN; }
            if (shield === void 0) { shield = 0; }
            var s = this;
            var numID, value;
            numID = s._scene._isMMO ? ly.RoleID.MMO_HP_NUM : ly.RoleID.HP_NUM;
            if (isCritical)
                hpType = addHp > 0 ? ly.HPNUM_TYPE.CRIT_HEAL : ly.HPNUM_TYPE.CRIT;
            s.setHp(s._hp + addHp, NaN, s._shieldHp + shield);
            if (boss)
                addHp = -s.getBossRandomHP();
            if (flowNum == flowNum)
                addHp = flowNum;
            if (addHp != 0) {
                if (s._scene._isMMO)
                    addHp = addHp < 0 ? -addHp : addHp;
                value = s.chaneNumber(addHp);
                s.addFlowNumber(numID, value, 0, -s._headJumpH, hpType);
            }
            if (shield != 0) {
                if (s._scene._isMMO)
                    shield = shield < 0 ? -shield : shield;
                value = s.chaneNumber(shield);
                s.addFlowNumber(numID, value, 0, -s._headJumpH, hpType);
            }
        };
        GameRole.prototype.setHp = function (val, max, shield, tween) {
            if (max === void 0) { max = NaN; }
            if (shield === void 0) { shield = 0; }
            if (tween === void 0) { tween = true; }
            var s = this;
            var mod = modules.n_player.PlayerMod.instance;
            if (max == max) {
                if (s._hpMax != max) {
                    s._hpMax = max;
                    if (s.isMyPlayer) {
                        mod.hp = s._hp || 0;
                        mod.maxHp = s._hpMax || 0;
                    }
                    s._attriCallFlag |= ly.AttriCallType.HPMAX;
                }
            }
            val = Math.max(s.getMinHp(), Math.min(s._hpMax, val));
            if (val != s._hp) {
                s._hp = val;
                if (s.isMyPlayer) {
                    mod.hp = s._hp || 0;
                    mod.maxHp = s._hpMax || 0;
                }
                s._attriCallFlag |= ly.AttriCallType.HP;
            }
            if (shield != s._shieldHp) {
                if (shield < 0)
                    shield = 0;
                s._shieldHp = shield;
                s._attriCallFlag |= ly.AttriCallType.HPSHIELD;
            }
            if (s._gameRoleSubType == 7)
                s.skinPercent = 1 - s._hp / s._hpMax;
            if (s.hpEffect) {
                s.hpEffect.setHp(s._hp, s._hpMax, s._shieldHp, tween);
            }
            if (s._hp > 0) {
                if (ly.StsType.cannotAction(s._sts))
                    s.setSts(s._scene.getSceneStandSts(), s.getBornDir());
                s._isDead = false;
            }
            else
                s._isDead = true;
        };
        GameRole.prototype.showBossBigBar = function () {
            return false;
        };
        GameRole.prototype.getMinHp = function () {
            return 0;
        };
        GameRole.prototype.getEnemyCamp = function () {
            var s = this;
            return s._camp == 1 ? 2 : 1;
        };
        GameRole.prototype.getEnemyList = function (campFlag, justInMyRange, findPeak, skill, num, rect) {
            if (campFlag === void 0) { campFlag = 4; }
            if (justInMyRange === void 0) { justInMyRange = false; }
            if (findPeak === void 0) { findPeak = 0; }
            if (skill === void 0) { skill = null; }
            if (num === void 0) { num = null; }
            if (rect === void 0) { rect = null; }
            var s = this;
            var arr;
            var len;
            var r;
            var dis, roleCampFlag, roleCampFlagIndex;
            var peakRoles, peakRoles2;
            var hasEnemyInRange, hasResourceInRange;
            var isEnemyInRange, isResourceInRange;
            var count;
            var tempArr;
            var canAtkFlag, rangeFlag;
            var MAX_DIS, maxDis, listTimeTick;
            var list;
            var skillType;
            skillType = skill ? skill.skillCfg.type : -1;
            var isBuffSkill, isHealSkill;
            if (skill) {
                isBuffSkill = skill.skillCfg.isBuffSkill;
                isHealSkill = skill.skillCfg.isHealSkill;
            }
            MAX_DIS = skill ? s.getAttackRangeMax(skill) : 640;
            if (num && num.length > 0) {
                count = [
                    num[0] | 0,
                    num[1] | 0,
                    num[2] | 0,
                ];
            }
            var aiDebugType;
            if (s.ai_debugger) {
                aiDebugType = justInMyRange ? ly.AIDebugType.SEARCH : ly.AIDebugType.ATTACK_SEARCH;
            }
            if (justInMyRange) {
                list = s._viewList;
                listTimeTick = s._viewListTimeTick;
            }
            else {
                list = s._viewAtkList;
                listTimeTick = s._viewAtkListTimeTick;
            }
            if (listTimeTick != s._scene.timeTick) {
                list.length = 0;
                r = s._scene.myPlayer;
                s.inRangeFlag = 1;
                if (rect) {
                    tempArr = justInMyRange ? [] : list;
                    s._scene.quadTree.getRectDisplays(rect[0], rect[1], rect[2], rect[3], tempArr);
                    if (justInMyRange) {
                        len = tempArr.length;
                        while (--len > -1) {
                            r = tempArr[len];
                            if (r.inAirPos || ly.MMOBuffLogic.hasBuffStealth(r, s))
                                continue;
                            dis = s.inMyRange(r, s.maxSkillRange);
                            r.tempDis = dis;
                            if (dis == Number.MAX_VALUE) {
                                s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInRange, r);
                                continue;
                            }
                            list[list.length] = r;
                        }
                    }
                    else
                        list = tempArr;
                }
                else {
                    if (justInMyRange) {
                        if (!ly.MMOBuffLogic.hasBuffStealth(r, s)) {
                            dis = s.inMyRange(r, s.maxSkillRange);
                            r.tempDis = dis;
                            if (dis == Number.MAX_VALUE) {
                                s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInRange, r);
                            }
                            else {
                                list[list.length] = r;
                            }
                        }
                    }
                    else
                        list[list.length] = r;
                    tempArr = s._scene.getMonsterList();
                    len = tempArr.length;
                    while (--len > -1) {
                        r = tempArr[len];
                        if (justInMyRange) {
                            if (ly.MMOBuffLogic.hasBuffStealth(r, s))
                                continue;
                            dis = s.inMyRange(r, s.maxSkillRange);
                            r.tempDis = dis;
                            if (dis == Number.MAX_VALUE) {
                                s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInRange, r);
                                continue;
                            }
                        }
                        list[list.length] = r;
                    }
                    tempArr = s._scene.getMonsterList2();
                    len = tempArr.length;
                    while (--len > -1) {
                        r = tempArr[len];
                        if (r.inAirPos || ly.MMOBuffLogic.hasBuffStealth(r, s))
                            continue;
                        if (justInMyRange) {
                            dis = s.inMyRange(r, s.maxSkillRange);
                            r.tempDis = dis;
                            if (dis == Number.MAX_VALUE) {
                                s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInRange, r);
                                continue;
                            }
                        }
                        list[list.length] = r;
                    }
                }
                listTimeTick = s._scene.timeTick;
            }
            if (justInMyRange)
                s._viewListTimeTick = listTimeTick;
            else
                s._viewAtkListTimeTick = listTimeTick;
            arr = list;
            if (findPeak > 0)
                peakRoles = [[], [], []];
            tempArr = [];
            len = arr.length;
            while (--len > -1) {
                r = arr[len];
                if (justInMyRange)
                    rangeFlag = true;
                else {
                    maxDis = r._bodyMinDis + MAX_DIS + 10;
                    rangeFlag = s.distanceToOther(r, false) < maxDis * maxDis;
                }
                canAtkFlag = rangeFlag && s.canAttack(r, campFlag);
                if (justInMyRange) {
                    if (r._camp == 2)
                        isResourceInRange = ly.PublicVar.isResource(r._gameRoleSubType);
                    isEnemyInRange = s._camp != r._camp && !isResourceInRange;
                    if (!hasResourceInRange)
                        s.hasResourceInRange = hasResourceInRange = isResourceInRange;
                    if (!hasEnemyInRange) {
                        hasEnemyInRange = isEnemyInRange;
                        s.setHasEnemyInRange(isEnemyInRange);
                    }
                    if (canAtkFlag)
                        s.inRangeFlag |= isEnemyInRange ? 4 : 2;
                    else {
                        s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, rangeFlag ? ly.AISearchResult.NotCanAtk : ly.AISearchResult.NotInRange, r);
                        continue;
                    }
                }
                if (!canAtkFlag)
                    continue;
                roleCampFlag = s.getCampFlag(r._id, r._camp);
                if ((campFlag & roleCampFlag) == 0) {
                    s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInCamp, r);
                    continue;
                }
                if ((campFlag & 4) > 0 && r._gameRoleType == ly.GameRoleType.PARTNER) {
                    s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInCamp, r);
                    continue;
                }
                if (!s.skillCanAtk(skillType, r._gameRoleSubType)) {
                    s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotCanAtkSkill, r);
                    continue;
                }
                if (justInMyRange) {
                    if (campFlag == 2 && !r._inMMOBattleState) {
                        s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInState, r);
                        continue;
                    }
                    if (isHealSkill && r._hp >= r._hpMax * ly.PublicVar.healCP) {
                        s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotInState, r);
                        continue;
                    }
                }
                if (findPeak > 0) {
                    roleCampFlagIndex = s.getCampFlagIndex(r._id, r._camp);
                    peakRoles2 = peakRoles[roleCampFlagIndex];
                    peakRoles2[peakRoles2.length] = r;
                }
                tempArr[tempArr.length] = r;
                s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.OK, r);
            }
            arr = tempArr;
            if (justInMyRange) {
                if (hasEnemyInRange && skillType > 2 || !hasEnemyInRange && !hasResourceInRange) {
                    s.ai_debugger && s.ai_debugger.addGetEnemyData(s._scene.timeTick, aiDebugType, ly.AISearchResult.NotEnemy);
                    arr.length = 0;
                    return arr;
                }
            }
            if (findPeak > 0) {
                arr.length = 0;
                var j = void 0, len2 = void 0;
                var roles = void 0;
                len = peakRoles.length;
                while (--len > -1) {
                    roles = peakRoles[len];
                    roles.sort(ly.PeakType.sortFuncs[findPeak]);
                    roles.length = count ? Math.min(count[len], roles.length) : Math.min(roles.length, 1);
                    len2 = roles.length;
                    if (len2 > 0) {
                        for (j = 0; j < len2; ++j) {
                            arr.push(roles[j]);
                        }
                    }
                }
            }
            return arr;
        };
        GameRole.prototype.getViewList = function () {
            if (this._viewListTimeTick == this._scene.timeTick)
                return this._viewList;
            return null;
        };
        GameRole.prototype.getBornDir = function () {
            var s = this;
            if (s._owner)
                return s._owner._campObj ? s._owner._campObj.bornDir : ly.DirectionType.LEFT;
            return s._campObj ? s._campObj.bornDir : ly.DirectionType.LEFT;
        };
        GameRole.prototype.setPower = function (val) {
            var s = this;
            s._power = val;
        };
        GameRole.prototype.getLockAtkRange = function (sts, dir, rateCfg) {
            if (dir === void 0) { dir = 0; }
            if (rateCfg === void 0) { rateCfg = null; }
            var s = this;
            rateCfg = rateCfg ? rateCfg : s.getRateCfg(sts, dir);
            return rateCfg.lockRange;
        };
        GameRole.prototype.getAtkIndices = function (sts, dir, rateCfg) {
            if (dir === void 0) { dir = 0; }
            if (rateCfg === void 0) { rateCfg = null; }
            var s = this;
            rateCfg = rateCfg ? rateCfg : s.getRateCfg(sts, dir);
            return rateCfg ? rateCfg.atkIndices : null;
        };
        GameRole.prototype.getAtkIndicesByFrame = function (startFrame, endFrame, disabledALLFrames, rateCfg) {
            if (disabledALLFrames === void 0) { disabledALLFrames = false; }
            if (rateCfg === void 0) { rateCfg = null; }
            var s = this;
            var result, atkIndices;
            var rateLen, i, len, minIndex;
            rateLen = s._skinPart._rateLen;
            minIndex = s.getAtkRangeMinIndex(s._sts, s._direction, rateCfg);
            if (minIndex == -1) {
                if (disabledALLFrames)
                    return null;
                result = [startFrame];
            }
            else {
                atkIndices = s.getAtkIndices(s._sts, s._direction, rateCfg);
                if (atkIndices == null || atkIndices.length == 0)
                    return null;
                var ind = void 0;
                result = [];
                len = atkIndices.length;
                for (i = 0; i < len; ++i) {
                    ind = atkIndices[i];
                    if (endFrame < startFrame) {
                        if (startFrame <= ind && ind < rateLen || 0 <= ind && ind < endFrame)
                            result[result.length] = ind;
                    }
                    else if (startFrame <= ind && ind < endFrame)
                        result[result.length] = ind;
                }
            }
            if (result.length == 0)
                return null;
            return result;
        };
        GameRole.prototype.getAtkRangeMinIndex = function (sts, dir, rateCfg) {
            if (dir === void 0) { dir = 0; }
            if (rateCfg === void 0) { rateCfg = null; }
            var s = this;
            rateCfg = rateCfg ? rateCfg : s.getRateCfg(sts, dir);
            return rateCfg ? rateCfg.minAtkRangeFrame : -1;
        };
        GameRole.prototype.getAtkRangeMaxIndex = function (sts, dir, rateCfg) {
            if (dir === void 0) { dir = 0; }
            if (rateCfg === void 0) { rateCfg = null; }
            var s = this;
            rateCfg = rateCfg ? rateCfg : s.getRateCfg(sts, dir);
            return rateCfg ? rateCfg.maxAtkRangeFrame : -1;
        };
        GameRole.prototype.getAttackRange = function (sts, rate, dir, rateCfg) {
            if (dir === void 0) { dir = 0; }
            if (rateCfg === void 0) { rateCfg = null; }
            var s = this;
            var atkRange;
            rateCfg = rateCfg ? rateCfg : s.getRateCfg(sts, dir);
            if (rateCfg.atkRange) {
                atkRange = rateCfg.atkRange[rate];
                if (atkRange == null && rateCfg.atkRange[-1])
                    return rateCfg.atkRange[-1];
            }
            return atkRange;
        };
        GameRole.prototype.getRateCfg = function (sts, dir) {
            if (dir === void 0) { dir = 0; }
            var s = this;
            var stsCfg;
            stsCfg = s._clothesConfig[sts] ? s._clothesConfig[sts] : s._clothesConfig[ly.StsType.STAND];
            return stsCfg.rate[dir] ? stsCfg.rate[dir] : stsCfg.rate[0];
        };
        GameRole.prototype.getAttackRangeMax = function (skill, dir) {
            if (dir === void 0) { dir = 0; }
            var s = this;
            var stsCfg;
            if (skill.skillCfg.skillRange == -1) {
                stsCfg = s._clothesConfig[skill.skillCfg.action];
                if (stsCfg) {
                    var atkMaxDis = stsCfg.rate[0].atkMaxDis;
                    if (atkMaxDis > 0)
                        return atkMaxDis;
                }
            }
            return skill.skillCfg.skillRange;
        };
        GameRole.prototype.getAttackRangeMin = function (skill, dir) {
            if (dir === void 0) { dir = 0; }
            var s = this;
            return s.getAttackRangeMax(skill, dir);
        };
        GameRole.prototype.updateBodyRange = function () {
            var aX, aY, i, len;
            var s = this;
            var range = s._bodyRange;
            var hitRange = s._clothesRate.hitRange;
            aX = s._absX;
            aY = s._absY;
            len = hitRange.length;
            for (i = 0; i < len; i += 2) {
                range[i] = aX + hitRange[i];
                range[i + 1] = aY + hitRange[i + 1];
            }
        };
        GameRole.prototype.getBodyRange = function (dir, useMyPos, toX, toY) {
            if (dir === void 0) { dir = 0; }
            if (useMyPos === void 0) { useMyPos = true; }
            if (toX === void 0) { toX = NaN; }
            if (toY === void 0) { toY = NaN; }
            var s = this;
            if (toX == toX && toY == toY) {
                var i = void 0, len = void 0;
                var range = [];
                var hitRange = s._clothesRate.hitRange;
                len = hitRange.length;
                for (i = 0; i < len; i += 2) {
                    range[i] = toX + hitRange[i];
                    range[i + 1] = toY + hitRange[i + 1];
                }
                return range;
            }
            else if (useMyPos) {
                return s._bodyRange;
            }
            else {
                return s._clothesRate.hitRange;
            }
        };
        GameRole.prototype.isBodyHit = function (x, y, bodyRange, bodyMinDis, dis) {
            if (dis === void 0) { dis = NaN; }
            var minDis;
            var s = this;
            dis = dis == dis ? dis : ly.PositionUtil.calculateDistance2(x, y, s._absX, s._absY);
            minDis = s._bodyMinDis + bodyMinDis;
            minDis *= minDis;
            if (dis > minDis)
                return false;
            if (ly.PositionUtil.isShapeInsert(s.getBodyRange(), bodyRange))
                return true;
        };
        GameRole.prototype.isCDOk = function (skill) {
            var s = this;
            var t;
            var skillCD, skillPreCD;
            skillCD = s._skillCDList[skill.skillId] ? s._skillCDList[skill.skillId] : 0;
            skillPreCD = s._skillPreCDList[skill.skillId] ? s._skillPreCDList[skill.skillId] : 0;
            t = s._scene.timeTick;
            var cd = skill.cd;
            return t - skillCD >= cd && t - skillPreCD >= skill.preCD;
        };
        GameRole.prototype.skillCDLeftTime = function (skill) {
            var s = this;
            var t;
            var skillCD;
            skillCD = s._skillCDList[skill.skillId] ? s._skillCDList[skill.skillId] : 0;
            t = s._scene.timeTick;
            return skill.cd - (t - skillCD);
        };
        GameRole.prototype.inMaxAtkRange = function (target, range) {
            var s = this;
            var arr;
            var i, len, dis, minDis;
            minDis = Number.MAX_VALUE;
            arr = target.getBodyRange(target._direction);
            len = arr.length;
            for (i = 0; i < len; i += 2) {
                dis = ly.PositionUtil.calculateDistance2(arr[i], arr[i + 1], s._absX, s._absY);
                if (dis < minDis)
                    minDis = dis;
            }
            dis = ly.PositionUtil.calculateDistance2(target._absX, target._absY, s._absX, s._absY);
            if (dis < minDis)
                minDis = dis;
            return minDis < range * range;
        };
        GameRole.prototype.filterInMaxAtkRange = function (targets, range) {
            var len;
            var s = this;
            var arr = [];
            var r;
            len = targets.length;
            while (--len > -1) {
                r = targets[len];
                if (s.inMaxAtkRange(r, range))
                    arr[arr.length] = r;
                else
                    s.ai_debugger && s.ai_debugger.addOperSkillData(s._scene.timeTick, ly.AIOperSkillResult.NotInRange, targets[len], 0, range, targets[len]._clothesRate.hitRange);
            }
            return arr;
        };
        GameRole.prototype.inSkillAttackRange = function (other, skill, dir, max) {
            if (dir === void 0) { dir = 0; }
            if (max === void 0) { max = true; }
            var s = this;
            var range;
            var arr;
            var i, len;
            if (max) {
                range = s.getAttackRangeMax(skill, dir);
                if (range == null)
                    range = s.getAttackRangeMin(skill, dir);
            }
            else {
                range = s.getAttackRangeMin(skill, dir);
                if (range == null)
                    range = s.getAttackRangeMax(skill, dir);
            }
            arr = other.getBodyRange(s._direction);
            if (arr && range) {
                var abX = void 0, abY = void 0, dis = void 0;
                len = arr.length;
                for (i = 0; i < len; i += 2) {
                    abX = other._absX + arr[i];
                    abY = other._absY + arr[i + 1];
                    dis = ly.PositionUtil.calculateDistance2(abX, abY, s._absX, s._absY);
                    if (dis <= range * range)
                        return true;
                }
                dis = ly.PositionUtil.calculateDistance2(other._absX, other._absY, s._absX, s._absY);
                if (dis <= range * range)
                    return true;
            }
            return false;
        };
        GameRole.prototype.getBulletTargets = function () {
            var s = this;
            if (s.multiHurt)
                return s._targetRoles;
            return [this._targetRoles[0]];
        };
        GameRole.prototype.getTargets = function () {
            return this._targetRoles;
        };
        GameRole.prototype.getAtkTarget = function () {
            var s = this;
            var len;
            len = s._mmoTargetRoles.length;
            while (--len > -1) {
                if (s._mmoTargetRoles[len]._id != s._mmoTargetIds[0]) {
                    s._mmoTargetRoles.splice(len, 1);
                    s._mmoTargetIds.splice(len, 1);
                }
            }
            return s._mmoTargetRoles;
        };
        GameRole.prototype.setAtkTarget = function (targets) {
            var s = this;
            if (targets) {
                s._mmoTargetRoles = targets;
                s._mmoTargetIds.length = 0;
                var len = void 0;
                len = s._mmoTargetRoles.length;
                while (--len > -1) {
                    s._mmoTargetIds[len] = s._mmoTargetRoles[len]._id;
                }
            }
            else {
                if (s._mmoTargetRoles)
                    s._mmoTargetRoles.length = 0;
                if (s._mmoTargetIds)
                    s._mmoTargetIds.length = 0;
            }
            s._new_detourClockwise = NaN;
        };
        GameRole.prototype.targetIsValid = function () {
            var s = this;
            if (s._mmoTargetRoles[0] == null)
                return false;
            return s._mmoTargetRoles[0]._id == s._mmoTargetIds[0];
        };
        GameRole.prototype.getAtkTargetIds = function () {
            return this._mmoTargetIds;
        };
        GameRole.prototype.vecToTarget = function (target) {
            var addX, addY;
            var s = this;
            if (target.col > s.col)
                addX = 1;
            else if (target.col < s.col)
                addX = -1;
            else
                addX = 0;
            if (target.row > s.row)
                addY = 1;
            else if (target.row < s.row)
                addY = -1;
            else
                addY = 0;
            ly.PositionUtil._pt.x = addX;
            ly.PositionUtil._pt.y = addY;
            return ly.PositionUtil._pt;
        };
        GameRole.prototype.getDirByNormalVec = function (vx, vy) {
            var tarDir;
            if (vx == 0) {
                if (vy < 0)
                    tarDir = ly.DirectionType.UP;
                else if (vy > 0)
                    tarDir = ly.DirectionType.DOWN;
                else
                    tarDir = -1;
            }
            else if (vx > 0) {
                if (vy < 0)
                    tarDir = ly.DirectionType.RIGHT_UP;
                else if (vy > 0)
                    tarDir = ly.DirectionType.RIGHT_DOWN;
                else
                    tarDir = -1;
            }
            else if (vx < 0) {
                if (vy < 0)
                    tarDir = ly.DirectionType.LEFT_UP;
                else if (vy > 0)
                    tarDir = ly.DirectionType.LEFT_DOWN;
                else
                    tarDir = -1;
            }
            return tarDir;
        };
        GameRole.prototype.addMMOBuff = function (id, buffId, atkOwnerData) {
            if (atkOwnerData === void 0) { atkOwnerData = null; }
            var buffData;
            var buffCfg;
            var s = this;
            var len;
            var buffTransDict = ly.Cfg_buff.ins.buffTransDict;
            buffCfg = s.checkMMOBuffCanAdd(id, buffId);
            if (buffCfg) {
                if (buffCfg.contain.length > 0) {
                    len = s._buffList.length;
                    while (--len > -1) {
                        if (buffCfg.contain[0] == -1 || buffCfg.contain.indexOf(s._buffList[len].id) > -1) {
                            buffData = s._buffList[len];
                            s._buffList.splice(len, 1);
                            s.removeOneBuff(buffData);
                            if (buffCfg.inexactEnunciation.length > 0) {
                                s.addFlowNumber(ly.RoleID.MMO_HP_NUM, buffCfg.inexactEnunciation, 0, 0, buffTransDict[buffCfg.id][1]);
                            }
                        }
                    }
                }
                buffData = ly.MMOBuffLogic.createMMOBuffData(id, s, atkOwnerData, buffCfg);
                ly.MMOBuffLogic.buffAdd(s, buffData);
                s._buffList.push(buffData);
                if (window["PF_INFO"]["console"]) {
                    Log.writeLog("打印战斗数据，buff添加" + " 角色id:" + s._roleID + " buffid:" + buffId + ",持续时间：" + buffCfg.buffsPersistRound);
                }
                this.setBuffBar();
                return buffData;
            }
            return null;
        };
        GameRole.prototype.removeBuff = function (id, includePassive, delEffect, delAffect) {
            if (includePassive === void 0) { includePassive = 3; }
            if (delEffect === void 0) { delEffect = true; }
            if (delAffect === void 0) { delAffect = true; }
            var s = this;
            var len;
            var buffData;
            len = s._buffList.length;
            while (--len > -1) {
                buffData = s._buffList[len];
                if (buffData.isPassive) {
                    if ((includePassive & 2) == 0)
                        continue;
                }
                else {
                    if ((includePassive & 1) == 0)
                        continue;
                }
                if (buffData.id == id || id == -1) {
                    s._buffList.splice(len, 1);
                    s.removeOneBuff(buffData, delEffect, delAffect);
                }
            }
            this.setBuffBar();
        };
        GameRole.prototype.removeOneBuff = function (buffData, delEffect, delAffect) {
            if (delEffect === void 0) { delEffect = true; }
            if (delAffect === void 0) { delAffect = true; }
            var s = this;
            if (delEffect && buffData.effect)
                buffData.effect.removeBuffData(buffData);
            if (s._scene._isMMO) {
                ly.MMOEffect.removeBuffEffect(s, buffData.id);
                if (delAffect)
                    ly.MMOBuffLogic.buffRemove(s, buffData);
            }
            if (window["PF_INFO"]["console"]) {
                Log.writeLog("打印战斗数据，buff删除" + " 角色id:" + s._roleID + " buffid:" + buffData.buffCfg.id) + " id:" + buffData.id;
            }
        };
        GameRole.prototype.checkMMOBuffAffect = function (affectType, atkOwnerData) {
            if (atkOwnerData === void 0) { atkOwnerData = null; }
            var len;
            var s = this;
            if (s._buffList.length == 0)
                return;
            len = s._buffList.length;
            while (--len > -1)
                ly.MMOBuffLogic.buffAffect(s, s._buffList[len], affectType, atkOwnerData);
        };
        GameRole.prototype.checkMMOSpecBuffAffect = function (atkOwnerData) {
            if (atkOwnerData === void 0) { atkOwnerData = null; }
            var len, j, len2;
            var buffData;
            var triggerbuff;
            var buffCfg;
            var s = this;
            if (s._buffList.length == 0)
                return;
            len = s._buffList.length;
            while (--len > -1) {
                buffData = s._buffList[len];
                buffCfg = buffData.buffCfg;
                if (buffCfg.trigger == 1) {
                    triggerbuff = atkOwnerData._skillCfg.triggerbuff;
                    len2 = triggerbuff.length;
                    for (j = 0; j < len2; j += 2) {
                        if (buffCfg.buffClassification == triggerbuff[j + 1]) {
                            var effectArr = void 0;
                            var affectBuffData = s.addMMOBuff(ly.Role.getRoleId(), triggerbuff[j], buffData.atkOwnerData);
                            if (affectBuffData) {
                                effectArr = ly.Cfg_buff.ins.getMMOEffectByBuffId(triggerbuff[j]);
                                ly.MMOEffect.addEffect(s, buffData.atkOwnerData, affectBuffData, s._scene.timeTick, ly.EffectType.BUFF, effectArr);
                            }
                        }
                    }
                }
            }
        };
        GameRole.prototype.checkMMOBuffCanAdd = function (id, buffId) {
            var buffCfg, buffCfg2;
            ;
            buffCfg = ly.Cfg_buff.ins.getMMOBuffById(buffId);
            var s = this;
            var len, count;
            var buffData;
            var buffTransDict = ly.Cfg_buff.ins.buffTransDict;
            count = buffCfg.compositionLimit > 0 ? buffCfg.compositionLimit : 1;
            len = s._buffList.length;
            while (--len > -1) {
                buffData = s._buffList[len];
                if (buffData.id == id)
                    return null;
                if (buffData.buffCfg.id == buffId) {
                    --count;
                    if (count == 0) {
                        buffData.effectStartTime = s._scene.timeTick;
                        if (buffData.effect)
                            buffData.effect.resetCreateTime(s._scene.timeTick);
                        return null;
                    }
                    continue;
                }
                buffCfg2 = buffData.buffCfg;
                if (buffCfg2.contain.indexOf(buffCfg.id) > -1) {
                    if (buffCfg2.inexactEnunciation.length > 0)
                        s.addFlowNumber(ly.RoleID.MMO_HP_NUM, buffCfg2.inexactEnunciation, 0, 0, buffTransDict[buffData.buffCfg.id][1]);
                    return null;
                }
            }
            return buffCfg;
        };
        GameRole.prototype.chaneNumber = function (value) {
            return (value < 0 ? "-" : "") + ly.UIHelper.bigNumToStr(Math.abs(value), 0);
        };
        GameRole.prototype.addFlowNumber = function (objID, value, x, y, hpType) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (hpType === void 0) { hpType = ly.HPNUM_TYPE.COMMON; }
            var s = this;
            if (hpType < ly.HPNUM_TYPE.COMMON || hpType > ly.HPNUM_TYPE.CRIT_HEAL)
                hpType = ly.HPNUM_TYPE.COMMON;
            if (ly.SkinDictionary.hpTypeWords[hpType].word)
                value = ly.SkinDictionary.hpTypeWords[hpType].word + value;
            s.addNumber({
                owner: s._scene._isMMO ? null : s,
                hpType: hpType,
                roleType: ly.RoleType.NUMBER_OBJ,
                objID: objID, x: x,
                y: y,
                value: value
            });
        };
        GameRole.prototype.addNumber = function (numberData) {
            var s = this;
            s._numberList[s._numberList.length] = numberData;
        };
        GameRole.prototype.removeNumber = function (numberObj) {
            if (numberObj === void 0) { numberObj = null; }
            var len;
            var s = this;
            if (numberObj == null) {
                s._numberList.length = 0;
                return;
            }
            len = s._numberList.length;
            while (--len > -1) {
                if (s._numberList[len].id == numberObj._id) {
                    s._numberList.splice(len, 1);
                    break;
                }
            }
        };
        GameRole.prototype.numberLoop = function (t) {
            var s = this;
            var numberData;
            numberData = s._numberList[0];
            if (numberData) {
                var num = void 0;
                var i = void 0, len = void 0, offsetX = void 0, offsetY = void 0;
                var numSkin = void 0;
                var spdPer = void 0, interval = void 0, lastInterval = void 0;
                len = s._numberList.length;
                spdPer = 10 / len;
                if (spdPer > 1)
                    spdPer = 1;
                interval = (s._scene._isMMO ? ly.PublicVar.mmoHpInterval : ly.PublicVar.hpInterval) * spdPer;
                lastInterval = t - s._lastFlowNumTime;
                if (lastInterval >= interval) {
                    offsetX = numberData.x + s._absX + (lastInterval > 1000 ? 0 : (s._scene._isMMO ? Math.random() * 80 - 40 : 0) | 0);
                    offsetY = numberData.y + s._absY;
                    numSkin = ly.SkinDictionary.hpNum[numberData.hpType];
                    num = s._scene.createNumberObj(numberData.owner, numberData.roleType, numberData.objID, offsetX, offsetY, numberData.value, numSkin);
                    num._skinPart.duration = Math.max(400, num._skinPart.duration * spdPer);
                    numberData.id = num._id;
                    s._lastFlowNumTime = t;
                    s._numberList.shift();
                }
            }
        };
        GameRole.prototype.clearAllBuff = function () {
            var s = this;
            var len;
            len = s._buffList.length;
            while (--len > -1)
                ly.MMOBuffLogic.linkBuffRecycle(s._buffList[len]);
            s._buffList.length = 0;
            s._buffEffects.length = 0;
            s._buffTypesAttr = {};
            s.buffLimitSet(false);
            s.buffValueReset();
            s.buffSpeedSet();
            s.setBuffBar();
        };
        GameRole.prototype.buffValueReset = function () {
            var s = this;
            s.buffValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            s.buffAffectList = [];
            s.buffShieldList = [];
        };
        GameRole.prototype.buffLimitSet = function (val) {
            var s = this;
            if (s._isLimit == val)
                return;
            s._isLimit = val;
            if (val) {
                s.pause(true);
                s.checkMMOBuffAffect(ly.BuffAffectType.LIMIT);
            }
            else {
                s.resume(true);
            }
        };
        GameRole.prototype.pause = function (includeMyObj) {
            if (includeMyObj === void 0) { includeMyObj = false; }
            _super.prototype.pause.call(this);
            var s = this;
            if (includeMyObj) {
                var i = void 0, len = void 0;
                var arr = s._attachments;
                ly.MMOEffect.pause(s.poolId);
                len = arr.length;
                for (i = 0; i < len; ++i)
                    arr[i].pause();
            }
        };
        GameRole.prototype.resume = function (includeMyObj) {
            if (includeMyObj === void 0) { includeMyObj = false; }
            var s = this;
            if (s._scene._isMMO) {
                if (s._isLimit)
                    return;
            }
            _super.prototype.resume.call(this);
            if (includeMyObj) {
                var i = void 0, len = void 0;
                var arr = s._attachments;
                ly.MMOEffect.resume(s.poolId);
                len = arr.length;
                for (i = 0; i < len; ++i)
                    arr[i].resume();
            }
        };
        GameRole.prototype.buffSpeedSet = function () {
            var s = this;
            s.speed = (s._scene.getDefault().move_speed / ly.CommonUtil.frameRate | 0) * (s.buffValues[ly.BuffEType.MOVE_SPEED] + 1);
            if (s.isFindPathMoving()) {
                var time = void 0;
                time = ly.PositionUtil.calculateDistance(s._absX, s._absY, s._targetX, s._targetY) / (s._speedPerMS * s._pathMoveRate);
                s._moveTimeTicker.duration = time;
                s._moveTimeTicker.init(s._scene.timeTick, time);
            }
            if (s.isMyPlayer)
                s._scene.getLeaderRole().speed = s.speed;
        };
        Object.defineProperty(GameRole.prototype, "canRevive", {
            get: function () {
                return this._canRevive || ly.MMOBuffLogic.hasBuffRevive(this);
            },
            set: function (val) {
                this._canRevive = val;
            },
            enumerable: true,
            configurable: true
        });
        GameRole.prototype.revive = function (hpPercent) {
            if (hpPercent === void 0) { hpPercent = 1; }
            var s = this;
            if (!s._isDead)
                return;
            var hp;
            s._scene.hangupSmartPaused = false;
            if (hpPercent > 1)
                hpPercent = 1;
            else if (hpPercent < 0)
                hpPercent = 0;
            hp = Math.floor(s._hpMax * hpPercent);
            s.addFlowNumber(ly.RoleID.MMO_HP_NUM, "" + hp, 0, -s._headJumpH, ly.HPNUM_TYPE.REVIVE);
            s.restoreSts(hp);
            s.setSts(s._scene.getSceneStandSts());
            s._scene.createEffect(s, ly.RoleType.EFFECT_OBJ, ly.RoleID.REVIVE, s._absX, s._absY, ly.StsType.STAND);
            var dis;
            dis = ly.PositionUtil.calculateDistance(s._absX, s._absY, s._scene._leaderRole._absX, s._scene._leaderRole._absY);
            if (dis > ly.PublicVar.transferDis) {
                s.transferTo(s._scene._leaderRole._absX, s._scene._leaderRole._absY);
            }
            if (window["PF_INFO"]["console"]) {
                Log.writeLog("打印战斗数据，状态复活" + " 角色id:" + s._roleID);
            }
            if (s.isMyPlayer) {
                GlobalData.notify.event(5062);
            }
        };
        GameRole.prototype.restore = function (restoreHp, checkBattleState, hpType) {
            if (checkBattleState === void 0) { checkBattleState = true; }
            if (hpType === void 0) { hpType = ly.HPNUM_TYPE.HEAL; }
            var s = this;
            if (s._isDead)
                return;
            if (s.isDel())
                return;
            if (s._hp == s._hpMax)
                return;
            if (checkBattleState && s._inMMOBattleState && (s.area == null || s.area.recover == 0))
                return;
            s.addHp(restoreHp, false, hpType);
            if (s._hp < s._hpMax)
                Laya.timer.once(1000, s, s.restore, [restoreHp], true);
        };
        GameRole.prototype.restoreSts = function (hp) {
            if (hp === void 0) { hp = NaN; }
            var s = this;
            s.setHp(hp == hp ? hp : s._hpMax, s._hpMax);
            s.removeBuff(-1);
            s.removeReviveCountDown();
        };
        GameRole.prototype.resetBornPos = function () {
            var s = this;
            if (s._isDead)
                return;
            s._absX = s._bornX;
            s._absY = s._bornY;
        };
        GameRole.prototype.isOnBornPos = function () {
            var s = this;
            return (s._absX | 0) == (s._bornX | 0) && (s._absY | 0) == (s._bornY | 0);
        };
        GameRole.prototype.playTransferOut = function (outCallBack, notTranserIn) {
            var s = this;
            if (outCallBack != null)
                s._transerOutCallBack = outCallBack;
            s._notTranserIn = notTranserIn;
            if (s._transerEffectOut == null) {
                s.setSts(ly.StsType.SEND_OUT);
                SoundCtrl.instance.playSound(SoundCtrl.instance.sendOut);
                s._transerEffectOut = s._scene.createEffect(s, ly.RoleType.EFFECT_OBJ, ly.RoleID.SEND_OUT, s._absX, s._absY, ly.StsType.STAND);
                if (!s._displayVisible)
                    s._transerEffectOut.setDisplayVisible(s._displayVisible);
            }
        };
        GameRole.prototype.playTransferIn = function (inCallBack) {
            var s = this;
            if (!s._transerInCallBack)
                s._transerInCallBack = inCallBack;
            if (s._transferX != null && s._transferX == s._transferX) {
                s.absX = s._transferX;
                s.absY = s._transferY;
                s._transferX = s._transferY = NaN;
            }
            s._scene.setScaleTo(1);
            Laya.timer.once(800, s, function () {
                modules.n_scene.SceneCtl.ins.transering = false;
                if (s.isDel())
                    return;
                if (s._transerEffectIn == null) {
                    s.setSts(ly.StsType.SEND_IN);
                    if (s.shadowEffect)
                        s.shadowEffect.setDisplayVisible(s._displayVisible);
                    SoundCtrl.instance.playSound(SoundCtrl.instance.sendIn);
                    s._transerEffectIn = s._scene.createEffect(s, ly.RoleType.EFFECT_OBJ, ly.RoleID.SEND_IN, s._absX, s._absY, ly.StsType.STAND);
                    if (!s._displayVisible)
                        s._transerEffectIn.setDisplayVisible(s._displayVisible);
                }
            });
        };
        GameRole.prototype.transferTo = function (x, y, outCallBack, inCallBack, notTranserIn) {
            var s = this;
            if (x != null)
                s._transferX = x;
            if (y != null)
                s._transferY = y;
            if (inCallBack != null)
                s._transerInCallBack = inCallBack;
            s.stopFindPath();
            s.playTransferOut(outCallBack, notTranserIn);
        };
        GameRole.prototype.getSceneSkinType = function (skinObj, skinType) {
            var isPlayer;
            var s = this;
            isPlayer = s._gameRoleType == ly.GameRoleType.PLAYER || s._gameRoleType == ly.GameRoleType.HUMAN_MONSTER;
            if (ly.DungeonCfg.ins.isNoSpineDungeon(s._scene.curDungeonType) && !isPlayer) {
                if (skinObj.skinType == ly.SkinType.SPINE)
                    return ly.SkinType.SEQ;
            }
            return skinType;
        };
        GameRole.prototype.setSkin = function (skinObj, callBack, skinType) {
            if (callBack === void 0) { callBack = null; }
            if (skinType === void 0) { skinType = NaN; }
            var s = this;
            skinType = s.getSceneSkinType(skinObj, skinType);
            _super.prototype.setSkin.call(this, skinObj, callBack, skinType);
        };
        GameRole.prototype.resetSkin = function (skinObj, createNew, skinType) {
            if (createNew === void 0) { createNew = false; }
            if (skinType === void 0) { skinType = NaN; }
            var s = this;
            skinType = s.getSceneSkinType(skinObj, skinType);
            _super.prototype.resetSkin.call(this, skinObj, createNew, skinType);
            s._bodyMinDis = s._clothesRate.bodyMinDis ? s._clothesRate.bodyMinDis : 32;
        };
        GameRole.prototype.setGameRoleType = function (type) {
            var s = this;
            s._gameRoleType = type;
            if (s._scene._isMMOPvp || s._gameRoleType == ly.GameRoleType.PET)
                s._canRevive = false;
            else if (s._gameRoleType == ly.GameRoleType.PARTNER)
                s._canRevive = true;
        };
        GameRole.prototype.skinPartLoaded = function () {
            var s = this;
            _super.prototype.skinPartLoaded.call(this);
            s.initEventAttacher();
        };
        GameRole.prototype.hasAttachEvent = function (sts, key) {
            var s = this;
            return s._attacher && s._attacher.hasKey(sts, key);
        };
        GameRole.prototype.initEventAttacher = function () {
            var s = this;
            if (s._attacher == null) {
                s._attacher = new ly.EventAttacher(s);
                s._attacher.validSkin();
            }
        };
        GameRole.prototype.getLeader = function () {
            var s = this;
            if (s._leader) {
                if (s._leader._id != s._leaderId)
                    s._leader = null;
            }
            if (s._leaderId > 0) {
                if (s._scene.myPlayer._id == s._leaderId)
                    return s._scene.myPlayer;
                if (s._leader == null)
                    s._leader = s._scene.findElementById(s._leaderId, ly.RoleType.PLAYER);
            }
            return s._leader;
        };
        GameRole.prototype.setLeader = function (leaderId, pos) {
            if (pos === void 0) { pos = 0; }
            var s = this;
            s._leaderId = leaderId;
            s.pos = pos;
        };
        GameRole.prototype.excShake = function () { };
        ;
        GameRole.prototype.excAttackSound = function () { };
        ;
        GameRole.prototype.excHitSound = function () { };
        ;
        GameRole.prototype.findEnemy = function (findPeak, campFlag, skill) {
            if (findPeak === void 0) { findPeak = ly.PeakType.MIN_DISTANCE; }
            if (campFlag === void 0) { campFlag = 4; }
            if (skill === void 0) { skill = null; }
            var s = this;
            s.hasResourceInRange = false;
            if ((campFlag & 4) > 0) {
                var roles = void 0;
                roles = s.findHateEnemy(ly.PeakType.HATE, skill);
                if (roles && roles.length > 0) {
                    s.setHasEnemyInRange(true);
                    return roles;
                }
            }
            s.setHasEnemyInRange(false);
            if (s._findEnemyRect[0] < s._findEnemyRect[2] && s._findEnemyRect[1] < s._findEnemyRect[3])
                return s.getEnemyList(campFlag, true, findPeak, skill, skill ? skill.skillCfg.num : null, s._findEnemyRect);
            return [];
        };
        GameRole.prototype.findHateEnemy = function (findPeak, skill) {
            if (findPeak === void 0) { findPeak = ly.PeakType.MIN_DISTANCE; }
            if (skill === void 0) { skill = null; }
            var s = this;
            if (s.hateList == null || s.hateList.length == 0)
                return null;
            s.hateList.sort(ly.PeakType.sortFuncs[findPeak]);
            var i, len;
            var r;
            var arr = [];
            var hateData;
            len = s.hateList.list.length;
            for (i = 0; i < len; ++i) {
                hateData = s.hateList.list[i];
                r = hateData.role;
                if (r._isDead || !hateData.isValid())
                    continue;
                arr.push(r);
            }
            return arr;
        };
        GameRole.prototype.getProritySkill = function (target) {
            var s = this;
            var skill, backupSkill;
            var i, len;
            var t;
            var targetIsMyCamp;
            targetIsMyCamp = s.targetIsMyCamp(target);
            t = s._scene.timeTick;
            len = s._skillList.length;
            for (i = 0; i < len; ++i) {
                skill = s._skillList[i];
                if (skill.skillCfg.priority == 0)
                    continue;
                if (t - s._lastSkillFailList[skill.skillId] < 200)
                    continue;
                if (target && !s.skillCanAtk(skill.skillCfg.type, target._gameRoleSubType)) {
                    if (skill.skillCfg.isResourceSkill && targetIsMyCamp)
                        backupSkill = skill;
                    continue;
                }
                if (s.isCDOk(skill))
                    return skill;
            }
            if (backupSkill) {
                if (s.isCDOk(backupSkill))
                    return backupSkill;
            }
            return null;
        };
        GameRole.prototype.isTeamInBattleState = function () {
            var len;
            var s = this;
            var r;
            var monsters;
            var stateObj;
            if (s._camp == 1) {
                stateObj = s._scene.frameData.getTeamBattleState(s._camp);
                if (stateObj.invalid) {
                    r = s._scene.myPlayer;
                    if (r._inMMOBattleState)
                        return true;
                    monsters = s._scene.getMonsterList();
                    len = monsters.length;
                    while (--len > -1) {
                        if (monsters[len]._inMMOBattleState) {
                            s._scene.frameData.setTeamBattleState(s._camp, true);
                            break;
                        }
                    }
                    s._scene.frameData.setTeamBattleState(s._camp, false);
                }
                return stateObj.state;
            }
            if (s._scene._isMMOPvp && s._camp == 2) {
                stateObj = s._scene.frameData.getTeamBattleState(s._camp);
                if (stateObj.invalid) {
                    monsters = s._scene.getMonsterList2();
                    len = monsters.length;
                    while (--len > -1) {
                        if (monsters[len]._inMMOBattleState) {
                            s._scene.frameData.setTeamBattleState(s._camp, true);
                            break;
                        }
                    }
                    s._scene.frameData.setTeamBattleState(s._camp, false);
                }
                return stateObj.state;
            }
            return s._inMMOBattleState;
        };
        GameRole.prototype.inMyRange = function (target, skillRange) {
            if (skillRange === void 0) { skillRange = 0; }
            var territoryRange, viewRange;
            var dis, dis2;
            var s = this;
            territoryRange = s._territoryRange2;
            if (s._camp == 1)
                dis2 = ly.PositionUtil.calculateDistance2(target._absX, target._absY, s._followPosX, s._followPosY) + skillRange;
            else
                dis2 = ly.PositionUtil.calculateDistance2(target._absX, target._absY, s._bornX, s._bornY) + skillRange;
            if (dis2 > territoryRange)
                return Number.MAX_VALUE;
            viewRange = s._viewRange2;
            dis = ly.PositionUtil.calculateDistance2(target._absX, target._absY, s._absX, s._absY);
            if (dis > viewRange)
                return Number.MAX_VALUE;
            return dis;
        };
        GameRole.prototype.inMyTerritoryRange = function () {
            var s = this;
            var dis;
            if (s._camp == 1)
                dis = ly.PositionUtil.calculateDistance2(s._absX, s._absY, s._followPosX, s._followPosY);
            else
                dis = ly.PositionUtil.calculateDistance2(s._absX, s._absY, s._bornX, s._bornY);
            return s._territoryRange2 > dis;
        };
        GameRole.prototype.inMyHateRange = function (target) {
            var s = this;
            var dis;
            dis = ly.PositionUtil.calculateDistance2(target._absX, target._absY, s._absX, s._absY);
            return s._hateRange2 > dis;
        };
        GameRole.prototype.getFindEnemyRect = function (result) {
            if (result === void 0) { result = null; }
            var s = this;
            var minX, minY, maxX, maxY;
            var tX, tY;
            var a, b;
            if (result == null)
                result = [];
            else
                result.length = 0;
            tX = (s._camp == 1 ? s._followPosX : s._bornX);
            tY = (s._camp == 1 ? s._followPosY : s._bornY);
            a = s._absX - s.viewRange;
            b = tX - s.territoryRange;
            minX = a > b ? a : b;
            a = s._absY - s.viewRange;
            b = tY - s.territoryRange;
            minY = a > b ? a : b;
            a = s._absX + s.viewRange;
            b = tX + s.territoryRange;
            maxX = a < b ? a : b;
            a = s._absY + s.viewRange;
            b = tY + s.territoryRange;
            maxY = a < b ? a : b;
            result[0] = minX;
            result[1] = minY;
            result[2] = maxX;
            result[3] = maxY;
            return result;
        };
        GameRole.prototype.resetTargetDir = function (target, angleOffet) {
            if (angleOffet === void 0) { angleOffet = 0; }
            var s = this;
            var tarAngle;
            tarAngle = ly.PositionUtil.calculateAngle(target._absX, target._absY, s._absX, s._absY) + angleOffet;
            s._targetAngle = tarAngle;
            s._targetDirection = ly.DirectionType.getDirectorSts(tarAngle);
        };
        GameRole.prototype.setRange = function (territoryRange, patrolRange, viewRange) {
            if (territoryRange === void 0) { territoryRange = NaN; }
            if (patrolRange === void 0) { patrolRange = NaN; }
            if (viewRange === void 0) { viewRange = NaN; }
            var s = this;
            if (territoryRange == territoryRange) {
                s.territoryRange = territoryRange | 0;
                if (s.territoryRange == 0)
                    s.territoryRange = 400;
                s._territoryRange2 = s.territoryRange * s.territoryRange;
            }
            if (patrolRange == patrolRange) {
                s.patrolRange = patrolRange | 0;
                if (s.patrolRange == 0)
                    s.patrolRange = 100;
                s._patrolRange2 = s.patrolRange * s.patrolRange;
            }
            if (viewRange == viewRange) {
                s.viewRange = viewRange | 0;
                if (s.viewRange == 0)
                    s.viewRange = 200;
                s._viewRange2 = s.viewRange * s.viewRange;
            }
        };
        GameRole.prototype.getFollowPos = function (toX, toY) {
            var s = this;
            var dir;
            var logic;
            var pt;
            var leader;
            leader = s.getLeader();
            if (leader == null)
                leader = s._scene.getLeaderRole();
            logic = s._scene.sceneLogic;
            dir = leader.direction;
            pt = logic.getOffsetPos(s._campObj, s.pos, ly.DirectionType.getDirectorAngle(dir));
            pt.x += toX;
            pt.y += toY;
            return pt;
        };
        GameRole.prototype.findBuffEffect = function (effectId) {
            return this._effectDict[effectId];
        };
        GameRole.prototype.addEffect = function (e) {
            var s = this;
            if (s._effectList.indexOf(e) == -1) {
                s._effectList.push(e);
                if (s._effectDict[e._roleID] && !s._effectDict[e._roleID].isDel())
                    e.setDisplayVisible(false);
                else
                    s._effectDict[e._roleID] = e;
            }
        };
        GameRole.prototype.removeEffect = function (e, del) {
            if (del === void 0) { del = false; }
            var s = this;
            var ind;
            if (s._effectDict && s._effectDict[e._roleID] == e)
                delete s._effectDict[e._roleID];
            ind = s._effectList.indexOf(e);
            if (ind > -1) {
                s._effectList.splice(ind, 1);
                if (del)
                    e.del();
                else if (s._transerEffectOut == e) {
                    if (s._transerOutCallBack) {
                        s._transerOutCallBack();
                        s._transerOutCallBack = null;
                    }
                    if (!s._notTranserIn) {
                        s.playTransferIn();
                    }
                    s._transerEffectOut = null;
                    s._notTranserIn = false;
                }
                else if (s._transerEffectIn == e) {
                    s.restoreSts();
                    if (s._transerInCallBack) {
                        s._transerInCallBack();
                        s._transerInCallBack = null;
                    }
                    s._transerEffectIn = null;
                }
            }
        };
        GameRole.prototype.clearEffect = function (clearAll) {
            if (clearAll === void 0) { clearAll = true; }
            var len;
            var s = this;
            var effectObj;
            len = s._effectList.length;
            for (var i = len - 1; i >= 0; --i) {
                if (!clearAll && (s._effectList[i].roleID == ly.RoleID.SEND_OUT || s._effectList[i].roleID == ly.RoleID.SEND_IN)) {
                    continue;
                }
                effectObj = s._effectList[i];
                s._effectList.splice(1, 1);
                effectObj.del();
            }
            if (clearAll) {
                s._transerEffectOut = null;
                s._transerEffectIn = null;
                s._notTranserIn = false;
            }
        };
        GameRole.prototype.addReviveCountDown = function (cd) {
            var s = this;
            if (s.reviveCD == null) {
                s.reviveCD = new ly.ReviveCD;
                s.reviveCD.y = -120;
                s.reviveCD.setCDEndCall(function () {
                    if (s.isSending())
                        return;
                    s.revive();
                }, s);
            }
            s._skin.addChild(s.reviveCD);
            s.reviveCD.start(cd);
        };
        GameRole.prototype.removeReviveCountDown = function () {
            var s = this;
            if (s.reviveCD) {
                s.reviveCD.destroy();
                s.reviveCD = null;
            }
        };
        GameRole.prototype.roleBarrierSet = function (val, flag, reset) {
            if (flag === void 0) { flag = ly.Barrier.AIR; }
            if (reset === void 0) { reset = true; }
            var s = this;
            var arr;
            var i, len, col, row, gridSize;
            s.roleBarrierData = val;
            if (val) {
                gridSize = s._scene._gridSize;
                arr = ly.PositionUtil.getGridPosByShape(val, 32, 32);
                len = arr.length;
                for (i = 0; i < len; i += 2) {
                    col = (s._absX + arr[i]) / gridSize | 0;
                    row = (s._absY + arr[i + 1]) / gridSize | 0;
                    s._scene.addRoleBarrier(s._id, flag, col, row, reset);
                }
            }
            else
                s._scene.removeRoleBarrier(s._id, flag);
        };
        GameRole.prototype.distanceToMyPlayer = function () {
            var s = this;
            return ly.PositionUtil.calculateDistance(s._absX, s._absY, s._scene.myPlayer._absX, s._scene.myPlayer._absY);
        };
        GameRole.prototype.distanceToLeaderRole = function () {
            var s = this;
            return ly.PositionUtil.calculateDistance(s._absX, s._absY, s._scene._leaderRole._absX, s._scene._leaderRole._absY);
        };
        GameRole.prototype.distanceToOther = function (other, sqrt) {
            if (sqrt === void 0) { sqrt = true; }
            var s = this;
            var ax, ay;
            var o;
            if (s._layerType >= ly.LayerType.ROLE_BACK) {
                o = s.getOwner();
                ax = o._absX;
                ay = o._absY;
            }
            else {
                ax = s._absX;
                ay = s._absY;
            }
            if (sqrt)
                return ly.PositionUtil.calculateDistance(ax, ay, other._absX, other._absY);
            return ly.PositionUtil.calculateDistance2(ax, ay, other._absX, other._absY);
        };
        GameRole.prototype.enableHistoryRoute = function (val, maxCount) {
            if (maxCount === void 0) { maxCount = NaN; }
            var s = this;
            if (maxCount == maxCount)
                s.historyRouteMax = maxCount;
            if (s._historyRouteEnabled == val)
                return;
            s._historyRouteEnabled = val;
            s._historyRoute = val ? [] : null;
        };
        GameRole.prototype.addHistoryPos = function (x, y) {
            var s = this;
            s._historyRoute.push(x, y);
            if (s._historyRoute.length / 2 > s.historyRouteMax)
                s._historyRoute.splice(0, 2);
        };
        GameRole.prototype.getHistoryRoute = function (x, y) {
            var i, len, dot;
            var s = this;
            var route = [];
            dot = NaN;
            len = s._historyRoute.length;
            if (len >= 4) {
                for (i = 0; i < len; i += 2) {
                    if (dot != dot && i < len - 2)
                        dot = ly.MathUtil.dot(s._historyRoute[i + 2] - s._historyRoute[i], s._historyRoute[i + 3] - s._historyRoute[i + 1], x - s._historyRoute[i], y - s._historyRoute[i + 1]);
                    if (dot > 0)
                        dot = NaN;
                    else
                        route.push(s._historyRoute[i], s._historyRoute[i + 1]);
                }
            }
            return route;
        };
        GameRole.prototype.findPathTo = function (toX, toY, speed, callBack, thisObj, sceneCall, sts, nMaxTry, endFlag, route) {
            var _this = this;
            if (speed === void 0) { speed = NaN; }
            if (callBack === void 0) { callBack = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (sceneCall === void 0) { sceneCall = true; }
            if (sts === void 0) { sts = NaN; }
            if (nMaxTry === void 0) { nMaxTry = 0; }
            if (endFlag === void 0) { endFlag = -1; }
            if (route === void 0) { route = null; }
            var s = this;
            if (s._scene.barrier.barrierGridState(s.col, s.row, ly.Barrier.WATER)) {
                var i = void 0, len = void 0, agl = void 0, x = void 0, y = void 0, dis = void 0;
                agl = ly.PositionUtil.calculateAngle(s.absX, s._absY, toX, toY);
                dis = ly.PositionUtil.calculateDistance(s.absX, s._absY, toX, toY);
                len = 4;
                for (i = 0; i < len; ++i) {
                    agl += i * ly.MathConst.HALF_PI;
                    x = s._absX + Math.cos(agl) * 96;
                    y = s._absY + Math.sin(agl) * 96;
                    if (!s._scene.getInsertLine(s.areaKey, s._absX, s._absY, x, y)) {
                        s.moveTo(x, y, function () {
                            if (s.isDel() || s._isDead || !ly.StsType.isStand(s._sts))
                                return;
                            return _super.prototype.findPathTo.call(_this, toX, toY, speed, callBack, thisObj, sceneCall, sts, nMaxTry, endFlag, route);
                        }, s);
                        return;
                    }
                }
                Log.writeLog("无法站在无法通行的格子上寻路!id:" + s._id + ",x:" + s._absX + ",y:" + s._absY, Log.ERROR);
                return null;
            }
            return _super.prototype.findPathTo.call(this, toX, toY, speed, callBack, thisObj, sceneCall, sts, nMaxTry, endFlag, route);
        };
        GameRole.prototype.cannotMove = function () {
            var s = this;
            return ly.StsType.cannotAction(s._sts) || ly.MMOBuffLogic.hasBuffLimit(s);
        };
        GameRole.prototype.addCallMonster = function (buffData, buffTypeData, index, monster) {
            var s = this;
            if (s._callMonsterDict == null)
                s._callMonsterDict = {};
            var key;
            key = buffData.buffCfg.id + "_" + buffTypeData.index + "_" + index;
            if (s._callMonsterDict[key] == null)
                s._callMonsterDict[key] = {
                    key: key,
                    buffData: buffData,
                    buffTypeData: buffTypeData,
                    index: index, monsters: [],
                    ids: [],
                    owner: s, ownerId: s._id
                };
            var d = s._callMonsterDict[key];
            d.monsters.push(monster);
            d.ids.push(monster._id);
            monster.callData = d;
            return d;
        };
        GameRole.prototype.removeCallMonster = function (callData, monster) {
            var s = this;
            if (s._callMonsterDict == null)
                return;
            var key;
            key = callData.key;
            var d = s._callMonsterDict[key];
            if (d == null)
                return;
            var ind = d.monsters.indexOf(monster);
            if (ind > -1) {
                d.monsters.splice(ind, 1);
                d.ids.splice(ind, 1);
            }
        };
        GameRole.prototype.getCallNum = function (buffData, buffTypeData, index) {
            var s = this;
            if (s._callMonsterDict == null)
                return 0;
            var key;
            key = buffData.buffCfg.id + "_" + buffTypeData.index + "_" + index;
            var d = s._callMonsterDict[key];
            if (d == null)
                return 0;
            return d.monsters.length;
        };
        GameRole.prototype.cdBuff = function (buffData, buffTypeData) {
            var s = this;
            var key;
            if (buffTypeData.cd == 0)
                return;
            key = buffData.buffCfg.id + "_" + buffTypeData.index;
            s._buffAffectTime[key] = s._scene.timeTick;
        };
        GameRole.prototype.buffIsCD = function (buffId, buffTypeData) {
            var s = this;
            var key;
            if (buffTypeData.cd == 0)
                return false;
            key = buffId + "_" + buffTypeData.index;
            if (s._buffAffectTime[key] == null)
                return false;
            return s._scene.timeTick - s._buffAffectTime[key] < buffTypeData.cd;
        };
        GameRole.prototype.getPassiveSkillData = function (skillID) {
            var ind = this.getPassiveSkillIndex(skillID);
            return ind == -1 ? null : this._passiveSkillList[ind];
        };
        GameRole.prototype.getSkillData = function (skillID) {
            var ind = this.getSkillIndex(skillID);
            return ind == -1 ? null : this._skillList[ind];
        };
        GameRole.prototype.getPassiveSkillIndex = function (skillID) {
            var s = this;
            var len = s._passiveSkillList.length;
            while (--len > -1) {
                if (s._passiveSkillList[len].skillId == skillID)
                    return len;
            }
            return -1;
        };
        GameRole.prototype.getSkillIndex = function (skillID) {
            var s = this;
            var len = s._skillList.length;
            while (--len > -1) {
                if (s._skillList[len].skillId == skillID)
                    return len;
            }
            return -1;
        };
        GameRole.prototype.getSkillEnhance = function (skillId) {
            var s = this;
            var len;
            var enhanceSkill;
            len = s._passiveSkillList.length;
            while (--len > -1) {
                enhanceSkill = s._passiveSkillList[len].skillCfg.enhanceSkills;
                if (enhanceSkill && enhanceSkill.length > 0) {
                    if (enhanceSkill[skillId])
                        return enhanceSkill[skillId];
                }
            }
            return 0;
        };
        GameRole.prototype.hangUpSmart = function () {
            var s = this;
            if (s._isDead)
                return;
            if (s._scene.hangupSmartPaused)
                return;
            if (ly.MMOBuffLogic.hasBuffLimit(s))
                return;
            if (s._sts == ly.StsType.SEND_OUT)
                return;
            if (s._camp == 1) {
                if (s._scene._isMMO) {
                    s.followLeader2();
                }
                else
                    s.followLeader();
            }
        };
        GameRole.prototype.resetMMOSmartState = function () {
            var s = this;
            s.setAtkTarget(null);
            s.hateList = null;
            s.inRangeFlag = 1;
            s._isDetachmentFromWar = false;
            s._inMMOResourceState = s._inMMOBattleState = false;
            s.hasResourceInRange = false;
            s.setHasEnemyInRange(false);
        };
        GameRole.prototype.monsterNewSmart = function () {
            var s = this;
            var t;
            if (s._isDead)
                return;
            if (s.inAirPos)
                return;
            if (s._scene.hangupSmartPaused)
                return;
            t = s._scene.timeTick;
            if (t - s._new_smartTime > 5000) {
                s.resetPreCD(t);
            }
            s._new_smartTime = t;
            if (s._sts >= ly.StsType.SEND_OUT || ly.MMOBuffLogic.hasBuffLimit(s))
                return;
            if (s._new_behavior == ly.Behavior.ATTACK)
                s.findAttackTarget();
            else if (s._new_behavior == ly.Behavior.DETOUR)
                s.detouring();
            else if (s._new_behavior == ly.Behavior.PATROL)
                s.patrol();
            else if (s._new_behavior == ly.Behavior.DETACHMENT)
                s.detachmentFromWar();
            else {
                s._new_findAtkTargetInterval = 500;
                s._new_findAtkTargetTime = 0;
                s._new_detourClockwise = NaN;
                s._new_detourInterval = 100;
                s._new_detourTime = 0;
                s._new_lastPatrolEnemyTime = s._new_lastPatrolTime = 0;
                s._new_behavior = s.canPatrol ? ly.Behavior.PATROL : ly.Behavior.ATTACK;
            }
        };
        GameRole.prototype.patrol = function () {
            var s = this;
            var targets;
            var target;
            var t;
            var skill;
            s.hasResourceInRange = false;
            s.setHasEnemyInRange(false);
            if (!s._visible)
                return;
            t = s._scene.timeTick;
            if ((t - s._new_lastPatrolEnemyTime > ly.Monster.NEW_HANG_PATROLENEMY_INTERVAL)) {
                if (Math.random() < 0.5)
                    return;
                s._new_lastPatrolEnemyTime = t;
                targets = s.getAtkTarget();
                target = targets[0];
                skill = s.getProritySkill(target);
                if (skill == null)
                    return;
                if (!s.canAttack(target, skill.skillCfg.campFlag)) {
                    s.setAtkTarget(s.findEnemy(ly.PublicVar.getFindEnemyPeak(skill), skill ? skill.skillCfg.campFlag : 4, skill));
                    target = s._mmoTargetRoles[0];
                    if (target == null)
                        s._lastSkillFailList[skill.skillId] = t;
                }
                if (target) {
                    s.stopFindPath();
                    s.attamptToAttack();
                    return;
                }
            }
            s.doPatrol(t);
        };
        GameRole.prototype.doPatrol = function (t) {
            var s = this;
            if ((t - s._new_lastPatrolTime > ly.Monster.NEW_HANG_PATROL_INTERVAL)) {
                var tX = void 0, tY = void 0;
                var r = Math.random();
                if (r < 0.5) {
                    s._new_lastPatrolTime = t + ly.Monster.NEW_HANG_PATROL_INTERVAL * r;
                }
                else if (!ly.StsType.isMove(s)) {
                    var temp = s.patrolRange * 2;
                    tX = s._bornX - s.patrolRange + Math.random() * temp;
                    tY = s._bornY - s.patrolRange + Math.random() * temp;
                    if (s._scene.isBarrier(tX, tY))
                        return;
                    s.findPathTo(tX, tY);
                    s._new_lastPatrolTime = t;
                }
            }
        };
        GameRole.prototype.findAttackTarget = function (check, speed) {
            if (check === void 0) { check = true; }
            if (speed === void 0) { speed = NaN; }
            var s = this;
            var t = s._scene.timeTick;
            if (check && t - s._new_findAtkTargetTime < s._new_findAtkTargetInterval)
                return;
            var target;
            var targets;
            if (s._isDead)
                return;
            if (s._skillList.length == 0)
                return;
            var skill;
            targets = s.getAtkTarget();
            target = targets[0];
            skill = s.getProritySkill(target);
            if (skill == null)
                return;
            if (s._inSafeArea || !s.inMyTerritoryRange()) {
                s.inRangeFlag = 1;
                s.setAtkTarget(null);
                target = null;
            }
            else {
                if (target) {
                    if (target._inSafeArea) {
                        s.setAtkTarget(null);
                        target = null;
                    }
                }
                if (target == null || !s.canAttack(target, skill.skillCfg.campFlag)) {
                    s.setAtkTarget(s.findEnemy(ly.PublicVar.getFindEnemyPeak(skill), skill ? skill.skillCfg.campFlag : 4, skill));
                    target = s._mmoTargetRoles[0];
                }
            }
            if (target) {
                s.stopFindPath();
                if (s._hasEnemyInRange) {
                    if (!s._inMMOBattleState) {
                        s.resetPreCD(t);
                        s._inMMOBattleState = true;
                        s._inMMOResourceState = false;
                    }
                }
                else if (!s._inMMOResourceState && s.hasResourceInRange) {
                    s._inMMOResourceState = true;
                }
                if (s.attackEnemy(s._mmoTargetRoles, false))
                    return;
                s.resetTargetDir(target);
                var toClosed = void 0;
                var dis = void 0, atkDis = void 0;
                if (s._camp == 1) {
                    dis = target._bodyMinDis;
                    toClosed = dis * dis > ly.PositionUtil.calculateDistance2(s._absX, s._absY, target._absX, target._absY);
                    if (toClosed) {
                        atkDis = s.getAttackRangeMax(skill, s._direction);
                        if (atkDis > dis) {
                            s._targetAngle = s._targetAngle + Math.PI;
                            s._targetDirection = ly.DirectionType.getDirectorSts(s._targetAngle);
                        }
                    }
                }
                var moveState = void 0;
                moveState = s.moveDir(s._targetAngle, speed, toClosed ? target : null);
                if (moveState.result < ly.MoveResult.PASS) {
                    if (s._moveStopRole) {
                        if (s._moveStopRole._camp == target._camp && s._moveStopRole._gameRoleType == target._gameRoleType) {
                            if (s._moveStopRole == target) {
                                if (speed <= 1) {
                                    s._new_findAtkTargetTime = 0;
                                    s.attempToDetour();
                                }
                                else {
                                    speed = Math.max(1, s._speed >> 1);
                                    s.moveDir(s._targetAngle, speed, toClosed ? target : null);
                                    if (s.attackEnemy(s._mmoTargetRoles, false))
                                        return;
                                }
                                return;
                            }
                            s.setAtkTarget([s._moveStopRole]);
                            return;
                        }
                    }
                    if (s._new_findAtkTargetTime > 0) {
                        s._new_findAtkTargetTime = 0;
                        s.attempToDetour();
                        return;
                    }
                    s._new_findAtkTargetTime = t;
                    return;
                }
                if (moveState.distanceX() < 3 && moveState.distanceY() < 3) {
                    s._new_findAtkTargetTime = 0;
                    s.attempToDetour();
                    return;
                }
                return;
            }
            s._lastSkillFailList[skill.skillId] = t;
            var nothingToDo = (4 & s.inRangeFlag) == 0;
            if (s._inMMOResourceState || s._inMMOBattleState) {
                if (nothingToDo)
                    s._new_behavior = ly.Behavior.DETACHMENT;
            }
            else if (s.canPatrol) {
                s._new_behavior = ly.Behavior.PATROL;
            }
            else if (!s._targetMove) {
                if (!ly.StsType.isStand(s._sts))
                    s.resetSts();
            }
        };
        GameRole.prototype.detouring = function (check) {
            if (check === void 0) { check = true; }
            var s = this;
            var moveState;
            var add;
            var t;
            t = s._scene.timeTick;
            if (s._isDead)
                return;
            if (s._new_detourClockwise != s._new_detourClockwise)
                s._new_detourClockwise = Math.random() > 0.5 ? 1 : -1;
            add = s._new_detourClockwise;
            if (check) {
                if (t - s._new_detourTime < s._new_detourInterval)
                    return;
                if (t - s._new_detourTime > 5000) {
                    s.attamptToAttack();
                    return;
                }
            }
            var tarAngle;
            var target;
            target = s._mmoTargetRoles[0];
            if (!s.targetIsValid()) {
                s.attamptToAttack();
                return;
            }
            s.resetTargetDir(target);
            if (s._new_detourDir == s._targetDirection) {
                tarAngle = s._targetAngle;
            }
            else
                tarAngle = ly.DirectionType.getDirectorAngle(s._new_detourDir);
            moveState = s.moveDir(tarAngle);
            if (moveState.result == ly.MoveResult.PASS && (moveState.distanceX() > 3 || moveState.distanceY() > 3)) {
                if (s._new_detourDir == s._targetDirection) {
                    s.attamptToAttack();
                    return;
                }
                if (moveState.isPosChange() || !moveState.isXYChange()) {
                    s._new_detourDir = s._new_detourDir - add;
                    if (s._new_detourDir < ly.DirectionType.UP)
                        s._new_detourDir = ly.DirectionType.LEFT_UP;
                    else if (s._new_detourDir > ly.DirectionType.LEFT_UP)
                        s._new_detourDir = ly.DirectionType.UP;
                }
            }
            else {
                s._new_detourDir = s._new_detourDir + add * 2;
                if (s._new_detourDir < ly.DirectionType.UP)
                    s._new_detourDir = ly.DirectionType.LEFT_UP;
                else if (s._new_detourDir > ly.DirectionType.LEFT_UP)
                    s._new_detourDir = ly.DirectionType.UP;
                if (s._moveStopRole) {
                    if (s.targetIsValid() && s._moveStopRole._camp == s._mmoTargetRoles[0]._camp && s._moveStopRole._gameRoleType == s._mmoTargetRoles[0]._gameRoleType) {
                        s.setAtkTarget([s._moveStopRole]);
                        s.attamptToAttack();
                        return;
                    }
                }
                ++s._new_detourCount;
                if (s._new_detourCount > 6) {
                    s._new_detourClockwise = NaN;
                    s.attempToDetour();
                }
            }
        };
        GameRole.prototype.attempToDetour = function () {
            var s = this;
            s._new_detourDir = s._targetDirection;
            s._new_behavior = ly.Behavior.DETOUR;
            s._new_detourCount = 0;
            s._new_detourTime = s._scene.timeTick;
        };
        GameRole.prototype.attamptToAttack = function () {
            var s = this;
            s._new_behavior = ly.Behavior.ATTACK;
        };
        GameRole.prototype.attackEnemy = function (targets, absAngle, findBest, useSkill) {
            if (absAngle === void 0) { absAngle = false; }
            if (findBest === void 0) { findBest = true; }
            if (useSkill === void 0) { useSkill = null; }
            var s = this;
            if (s._sts >= ly.StsType.ATTACK)
                return true;
            if (useSkill)
                return s.attackEnemyBySkill(targets, absAngle, findBest, useSkill);
            var skill;
            var i, len;
            len = s._skillList.length;
            for (i = 0; i < len; ++i) {
                skill = s._skillList[i];
                if (skill.skillCfg.priority == 0)
                    continue;
                if (s.isCDOk(skill)) {
                    if (s.attackEnemyBySkill(targets, absAngle, false, skill))
                        return true;
                }
            }
            return false;
        };
        GameRole.prototype.attackEnemyBySkill = function (targets, absAngle, findBest, skill) {
            if (absAngle === void 0) { absAngle = false; }
            if (findBest === void 0) { findBest = true; }
            if (skill === void 0) { skill = null; }
            var s = this;
            var tarAngle, direction;
            var bestTargets;
            var maxRange;
            var skillCfg;
            skillCfg = skill.skillCfg;
            if (skill.skillCfg.isSkill && s.buffValues[ly.BuffEType.SLIENT])
                return;
            if (skill.skillCfg.isCommonAtk && s.buffValues[ly.BuffEType.DISARM])
                return;
            maxRange = s.getAttackRangeMax(skill);
            if (findBest) {
                bestTargets = s.findEnemy(skillCfg.condition, skillCfg.campFlag, skill);
                bestTargets = s.filterInMaxAtkRange(bestTargets, maxRange);
                if (bestTargets.length == 0)
                    return false;
                targets = bestTargets;
            }
            else {
                targets = s.filterInMaxAtkRange(targets, maxRange);
                if (targets.length == 0)
                    return false;
            }
            var i, len;
            var target;
            var campFlagIndex;
            var count;
            count = skillCfg.num.length > 0 ? [
                skillCfg.num[0] | 0,
                skillCfg.num[1] | 0,
                skillCfg.num[2] | 0
            ] : null;
            len = targets.length;
            while (--len > -1) {
                target = targets[len];
                if (!s.skillCanAtk(skillCfg.type, target._gameRoleSubType)) {
                    s.ai_debugger && s.ai_debugger.addOperSkillData(s._scene.timeTick, ly.AIOperSkillResult.NotCanAtkSkill, targets[len], skill.skillId);
                    targets.splice(len, 1);
                    continue;
                }
                if (count) {
                    campFlagIndex = s.getCampFlagIndex(target._id, target._camp);
                    if (count[campFlagIndex] == 0) {
                        s.ai_debugger && s.ai_debugger.addOperSkillData(s._scene.timeTick, ly.AIOperSkillResult.NotEnough, targets[len], skill.skillId);
                        targets.splice(len, 1);
                        continue;
                    }
                    --count[campFlagIndex];
                }
                if ((s.getCampFlag(target._id, target._camp) & skillCfg.campFlag) == 0) {
                    s.ai_debugger && s.ai_debugger.addOperSkillData(s._scene.timeTick, ly.AIOperSkillResult.NotInCamp, targets[len], skill.skillId);
                    targets.splice(len, 1);
                    continue;
                }
            }
            target = targets[0];
            if (target == null) {
                s.ai_debugger && s.ai_debugger.addOperSkillData(s._scene.timeTick, ly.AIOperSkillResult.NotInCamp, null, skill.skillId);
                return false;
            }
            if (skillCfg.warnSkill) {
                s._warnSkillPos = [];
                len = targets.length;
                while (--len > -1)
                    s._warnSkillPos.push(targets[len]._absX, targets[len]._absY);
            }
            else {
                s.setAtkTarget(targets);
            }
            if (s == target)
                direction = -1;
            else {
                tarAngle = absAngle ? ly.PositionUtil.calculateAngle(target._absX, target._absY, s._absX, s._absY) : ly.PositionUtil.calculateAngle(target.col, target.row, s.col, s.row);
                direction = ly.DirectionType.getDirectorSts(tarAngle);
                if (direction == ly.DirectionType.UP || direction == ly.DirectionType.DOWN) {
                    if (target._absX == s._absX) {
                        direction = target._absY > s._absY ? ly.DirectionType.RIGHT : ly.DirectionType.LEFT;
                    }
                    else {
                        direction = target._absX > s._absX ? ly.DirectionType.RIGHT : ly.DirectionType.LEFT;
                    }
                }
            }
            s.ai_debugger && s.ai_debugger.addOperSkillData(s._scene.timeTick, ly.AIOperSkillResult.OK, target, skill.skillId);
            s.operMMOSkill(skill, direction);
            return true;
        };
        GameRole.prototype.detachmentFromWar = function () {
            var s = this;
            var t = s._scene.timeTick;
            if (s._isDetachmentFromWar) {
                if (!s._targetMove) {
                    s.resetSts();
                    s.resetMMOSmartState();
                    s._new_behavior = ly.Behavior.ATTACK;
                }
                return;
            }
            var len;
            var buffCfg;
            len = s._buffList.length;
            if (len > 0) {
                while (--len > -1) {
                    buffCfg = s._buffList[len].buffCfg;
                    if (buffCfg.buffKeepType == ly.BuffKeepType.DETACHMENT)
                        s.removeBuff(buffCfg.id, 1);
                }
            }
            s.ai_debugger && s.ai_debugger.addDetachment(t);
            s._isDetachmentFromWar = true;
            s._inMMOResourceState = s._inMMOBattleState = false;
            s.hasResourceInRange = false;
            s.setHasEnemyInRange(false);
            if (!s._scene._isMMOPvp) {
                var hp = void 0;
                hp = Math.min(s._hpMax - s._hp, Math.ceil((s._camp == 2 ? ly.PublicVar.monsterRP : ly.PublicVar.playerRP) * s._hpMax));
                s.restore(hp);
            }
            if (!ly.StsType.isStand(s._sts))
                s.resetSts();
            s.resetPreCD(t);
            if (s.isMyPartner || s.isMyPlayer) {
                var pt = void 0;
                var leader = void 0;
                var isBarrier = void 0;
                pt = Laya.Point.TEMP;
                leader = s._scene.getLeaderRole();
                if (s.isMyPlayer)
                    pt.setTo(leader._absX, leader._absY);
                else
                    pt.setTo(s._followPosX, s._followPosY);
                isBarrier = s._scene.isBarrier(pt.x, pt.y);
                if (isBarrier) {
                    if (!s.isMyPlayer) {
                        pt.x = leader._absX;
                        pt.y = leader._absY;
                        isBarrier = s._scene.isBarrier(pt.x, pt.y);
                    }
                }
                if (isBarrier) {
                    var result = void 0;
                    Laya.Point.TEMP.setTo(pt.x, pt.y);
                    ly.MathUtil.tempPt.setTo(s._absX, s._absY);
                    result = s._scene.getNearPassPos(Laya.Point.TEMP, 1, null, ly.MathUtil.tempPt);
                    if (result) {
                        pt.x = result.x;
                        pt.y = result.y;
                        isBarrier = false;
                    }
                }
                if (isBarrier) {
                    s.resetMMOSmartState();
                    s._new_behavior = ly.Behavior.ATTACK;
                }
                else {
                    s.findPathTo(pt.x, pt.y, NaN, function () {
                        s.resetMMOSmartState();
                        s._new_behavior = ly.Behavior.ATTACK;
                    });
                }
            }
            else {
                s.findPathTo(s._bornX, s._bornY, NaN, function () {
                    s.resetMMOSmartState();
                    s._new_behavior = ly.Behavior.ATTACK;
                });
            }
        };
        GameRole.prototype.operMMOSkillId = function (skillId) {
            var s = this;
            var len;
            len = s._skillList.length;
            while (--len > -1) {
                if (s._skillList[len].skillId == skillId) {
                    s.operMMOSkill(s._skillList[len]);
                    return;
                }
            }
            GlobalData.throwError("释放技能列表不存在的技能:" + skillId);
        };
        GameRole.prototype.resetPreCD = function (t) {
            var s = this;
            var len;
            len = s._skillList.length;
            while (--len > -1)
                s._skillPreCDList[s._skillList[len].skillId] = t;
        };
        GameRole.prototype.cdSkill = function (skill) {
            var s = this;
            var t;
            t = s._scene.timeTick;
            if (s._skillPreCDList[skill.skillId] == null)
                s._skillPreCDList[skill.skillId] = t;
            s._skillCDList[skill.skillId] = t;
        };
        GameRole.prototype.operMMOSkill = function (skill, direction) {
            if (direction === void 0) { direction = -1; }
            var s = this;
            if (skill.skillCfg.warnSkill && s._sts != ly.StsType.WARN && s._sts != ly.StsType.WARN_LOOP) {
                s._tmpSkill = skill;
                var warnSkillCfg = ly.Conf.getMMOSkill(skill.skillCfg.warnSkill);
                var effectId = void 0;
                if (warnSkillCfg.ballisticEffect && warnSkillCfg.ballisticEffect.length > 0) {
                    effectId = warnSkillCfg.ballisticEffect[0].id;
                }
                else if (warnSkillCfg.explosionEffect && warnSkillCfg.explosionEffect.length > 0) {
                    effectId = warnSkillCfg.explosionEffect[0].id;
                }
                var effectCfg = ly.Conf.effectResource[effectId];
                if (effectCfg) {
                    s._warnSkillLoopTime = Math.max(effectCfg.loopTime - warnSkillCfg.actionTime, 0);
                    var warnSkill = {
                        skillId: warnSkillCfg.skillId,
                        skillCfg: warnSkillCfg,
                        cd: warnSkillCfg.cd,
                        preCD: warnSkillCfg.preCd
                    };
                    s.operMMOSkill(warnSkill, direction);
                    GlobalData.notify.event(5064);
                    return;
                }
                else
                    Log.writeLog("技能" + skill.skillId + "配置的预警技能" + skill.skillCfg.warnSkill + "但没有配置弹道特效(ballisticEffect)或者聚气特效(explosionEffect)", Log.ERROR);
            }
            if (window["PF_INFO"]["console"]) {
                Log.writeLog("打印战斗数据，技能ID:" + skill.skillCfg.skillId + " 角色id:" + s._roleID);
            }
            s.cdSkill(skill);
            s._ownerData = new ly.OwnerData(s, skill, s.getSkillEnhance(skill.skillId));
            s.checkMMOBuffAffect(ly.BuffAffectType.ATTACK);
            s.setOperSts(skill.skillCfg.action, direction == direction ? direction : s._direction);
        };
        GameRole.prototype.setOwnerData = function (ownerData) {
            var s = this;
            s._ownerData = ownerData;
            if (s._ownerData)
                s._camp = s._ownerData._camp;
            else
                s._camp = s._campObj.camp;
        };
        GameRole.prototype.setIdFromServer = function (id) {
            _super.prototype.setIdFromServer.call(this, id);
            this.ai_debugger && (this.ai_debugger.id = id);
        };
        GameRole.prototype.followLeader = function () {
            var s = this;
            var tX, tY;
            var dis;
            var r;
            r = s._scene.getLeaderRole();
            var gridSize = s._scene._gridSize;
            if (s.hangFollowDis > 0) {
                dis = ly.PositionUtil.calculateDistance(s._absX, s._absY, r._absX, r._absY);
                if (dis < s.hangFollowDis * 0.8)
                    return;
                s._pathMoveRate = Math.min(1.5, Math.max(0.5, (dis - s.hangFollowDis) / s.hangFollowDis * 0.8));
            }
            else
                s._pathMoveRate = 1;
            var pt = Laya.Point.TEMP;
            var result;
            if (!s._targetMove || (s._scene.timeTick - s._lastFindPathTime > GameRole.HANG_SMART_INTERVAL)) {
                tX = r._absX;
                tY = r._absY;
                pt.setTo(s._followPosX, s._followPosY);
                if (s.canPass(pt.x, pt.y)) {
                    tX = pt.x;
                    tY = pt.y;
                }
                if ((Math.abs(tX - s._absX) > gridSize || Math.abs(tY - s._absY) > gridSize)) {
                    s._lastFindPathTime = s._scene.timeTick;
                    if (result) {
                        s.startPathMove(result.movePath, NaN, null, null, true, s.findPathSts);
                    }
                    else {
                        s.findPathTo(tX, tY, NaN, function (code, msg) {
                            if (code == 0)
                                s.followLeader();
                        }, s, true, s.findPathSts);
                    }
                }
                else if (ly.StsType.isMove(s) && !ly.StsType.isMove(r))
                    s.setSts(s._scene.getSceneStandSts());
            }
            if (ly.StsType.isStand(s._sts) && s._direction != r.direction) {
                s.setSts(s._sts, r.direction);
            }
        };
        GameRole.prototype.followLeader2 = function () {
            var s = this;
            var agl, agl2;
            var pt;
            var dis, speed;
            var t;
            t = s._scene.timeTick;
            if (t - s._lastCheckPathTime < 100)
                return;
            if (s.cannotMove())
                return;
            if (s._speed == 0) {
                s.setDirection(s._scene.getLeaderRole().direction);
                return;
            }
            dis = ly.PositionUtil.calculateDistance(s._absX, s._absY, s._scene._leaderRole._absX, s._scene._leaderRole._absY);
            if (dis > ly.PublicVar.transferDis && dis > s.viewRange) {
                s._followHistoryRoute = null;
                if (s.isFindPathMoving())
                    s.stopFindPath();
                s.setSts(ly.StsType.SEND_OUT, -1, null, function () {
                    if (s.isDel() || s._isDead)
                        return;
                    s.absX = s._scene._leaderRole._absX;
                    s.absY = s._scene._leaderRole._absY;
                    s.setSts(ly.StsType.SEND_IN);
                }, s);
                return;
            }
            var moveState;
            pt = Laya.Point.TEMP;
            if (s._followHistoryRoute && s._followHistoryRoute.length > 0) {
                pt.setTo(s._followHistoryRoute[0], s._followHistoryRoute[1]);
                speed = Math.max(s._speed, s._speed * Math.min(2, dis / 150));
                dis = ly.PositionUtil.calculateDistance(s._absX, s._absY, pt.x, pt.y);
                if (speed > dis) {
                    speed = dis;
                    if (s._followHistoryRoute.length <= 2)
                        s._followHistoryRoute = null;
                    else
                        s._followHistoryRoute.splice(0, 2);
                }
                agl = ly.PositionUtil.calculateAngle(pt.x, pt.y, s._absX, s._absY);
                moveState = s.moveDir(agl, speed);
                if (moveState.result == ly.MoveResult.BARRIER) {
                    s._followHistoryRoute = null;
                }
                return;
            }
            pt.setTo(s._followPosX, s._followPosY);
            s._followHistoryRoute = null;
            if (Math.abs(pt.x - s._absX) > s._speed || Math.abs(pt.y - s._absY) > s._speed) {
                speed = Math.max(s._speed, s._speed * Math.min(2, dis / 150));
                agl = ly.PositionUtil.calculateAngle(pt.x, pt.y, s._absX, s._absY);
                moveState = s.moveDir(agl, speed);
                if (moveState.result & (ly.MoveResult.WALL | ly.MoveResult.BARRIER)) {
                    if (dis - s._lastDis > ly.PublicVar.findPathDis && s._scene._leaderRole._historyRoute && s._scene._leaderRole._historyRoute.length > 0 && (s._followHistoryRoute == null || s._followHistoryRoute.length == 0)) {
                        var route = ly.PositionUtil.getBestRoute(s._absX, s._absY, s._scene._leaderRole._absX, s._scene._leaderRole._absY, s._scene._leaderRole._historyRoute);
                        if (route) {
                            s._followHistoryRoute = route.pts.slice(route.stInd, route.endInd);
                            if (s._followHistoryRoute.length == 0) {
                                pt.setTo(s._followPosX, s._followPosY);
                                s._followHistoryRoute = null;
                            }
                        }
                    }
                }
            }
            else if (!s._scene.sceneLogic.isDirectBoardRunning() && ly.StsType.isMove(s)) {
                s.resetSts();
            }
        };
        GameRole.prototype.moveToFollowPos = function () {
            var s = this;
            var r;
            var pt;
            r = s._scene.getLeaderRole();
            pt = s.getFollowPos(r._absX, r._absY);
            s._followPosX = pt.x;
            s._followPosY = pt.y;
            var dis = ly.PositionUtil.calculateDistance(s._absX, s._absY, s._followPosX, s._followPosY);
            if (s.canPass(s._followPosX, s._followPosY) && dis > 2) {
                s.findPathTo(s._followPosX, s._followPosY);
            }
            else if (ly.StsType.isMove(s)) {
                s.resetSts();
            }
            else if (dis <= 2) {
                s.setSts(s._scene.getSceneStandSts());
            }
        };
        GameRole.prototype.moveStep = function (agl, speed, ignoreMoveStopRole) {
            if (speed === void 0) { speed = NaN; }
            if (ignoreMoveStopRole === void 0) { ignoreMoveStopRole = null; }
            var s = this;
            var barrierStateX, barrierStateY;
            var gridSize, deflectionAngle;
            gridSize = s._scene.sceneLogic._posGridW;
            if (speed != speed)
                speed = s._speed;
            s._moveState.setData(s, agl, speed, gridSize, gridSize);
            s._moveState.deflectionAngle = 0;
            if (s._scene.ignoreBarrier) {
                s._moveState.result = ly.MoveResult.PASS;
                return s._moveState;
            }
            var airCheck = !s._scene.isBarrier(s._moveState._toX, s._moveState._toY, ly.Barrier.AIR);
            deflectionAngle = s.getInsertDeflectionAngle(s.areaKey, s._moveState, speed, agl);
            if (deflectionAngle == deflectionAngle) {
                s._moveState.setData(s, agl + deflectionAngle, speed, gridSize, gridSize);
                s._moveState.deflectionAngle = deflectionAngle;
                if (deflectionAngle != 0) {
                    if (s._scene.barrier.barrierGridState(s._moveState._toCol, s._moveState._toRow, ly.Barrier.AIR) > 0) {
                        s._moveState.barrierX();
                        s._moveState.barrierY();
                        s._moveState.result = ly.MoveResult.BARRIER;
                        return s._moveState;
                    }
                    else {
                        s._moveState.result |= ly.MoveResult.WALL;
                        if (!airCheck)
                            return s._moveState;
                    }
                }
            }
            else {
                s._moveState.barrierX();
                s._moveState.barrierY();
                s._moveState.result = ly.MoveResult.BARRIER;
                return s._moveState;
            }
            if (s._moveState.isXChange()) {
                if (!s._moveState.isColChange())
                    s._moveState.result |= ly.MoveResult.PASS;
                else {
                    barrierStateX = s.canPass(s._moveState._toX, s._absY, ly.Barrier.STEP_PASS);
                    if (barrierStateX == 0)
                        s._moveState.barrierX();
                    else
                        s._moveState.result |= ly.MoveResult.PASS;
                }
            }
            if (s._moveState.isYChange()) {
                if (!s._moveState.isRowChange())
                    s._moveState.result |= ly.MoveResult.PASS;
                else {
                    barrierStateY = s.canPass(s._absX, s._moveState._toY, ly.Barrier.STEP_PASS);
                    if (barrierStateY == 0)
                        s._moveState.barrierY();
                    else
                        s._moveState.result |= ly.MoveResult.PASS;
                }
            }
            else if (barrierStateX > 0 && barrierStateY > 0 && !s.canPass(s._moveState._toX, s._moveState._toY, ly.Barrier.STEP_PASS))
                s._moveState.result |= ly.MoveResult.BARRIER;
            if (s._moveState.result == ly.MoveResult.NONE)
                s._moveState.result = ly.MoveResult.BARRIER;
            return s._moveState;
        };
        GameRole.prototype.getInsertDeflectionAngle = function (areaKey, moveState, speed, agl) {
            var s = this;
            var result;
            var vec;
            var gridSize, vx, vy, deflectionAngle;
            deflectionAngle = 0;
            vx = moveState._toX - moveState._fromX;
            vy = moveState._toY - moveState._fromY;
            gridSize = s._scene._gridSize;
            var len = 3;
            while (--len > -1) {
                result = s._scene.getInsertLine(areaKey, moveState._fromX, moveState._fromY, moveState._toX, moveState._toY);
                if (result) {
                    if (len == 0)
                        return NaN;
                    vec = result[0];
                    var vecX = void 0, vecY = void 0;
                    vecX = vec[0] - vec[2];
                    vecY = vec[1] - vec[3];
                    deflectionAngle = ly.MathUtil.calDeflectionAngle(vecX, vecY, vx, vy);
                    moveState.setData(s, agl + deflectionAngle, speed, gridSize, gridSize);
                }
                else
                    break;
            }
            return deflectionAngle;
        };
        GameRole.prototype.setCmdList = function (list) {
            var s = this;
            s._skillCmds = list;
        };
        GameRole.prototype.getCurCmdId = function (ind) {
            if (ind === void 0) { ind = 0; }
            var s = this;
            if (s._skillCmds == null || s._skillCmds.length == 0)
                return -1;
            ind = Math.min(ind, s._skillCmds.length - 1);
            return s._skillCmds[ind].selectProject;
        };
        GameRole.prototype.getCurCmdList = function (ind) {
            if (ind === void 0) { ind = 0; }
            var s = this;
            if (s._skillCmds == null || s._skillCmds.length == 0)
                return null;
            ind = Math.min(ind, s._skillCmds.length - 1);
            return s._skillCmds[ind].skillIdList;
        };
        GameRole.prototype.getCanUseCmdList = function (ind) {
            if (ind === void 0) { ind = 0; }
            var s = this;
            if (s._skillCmds == null || s._skillCmds.length == 0)
                return null;
            ind = Math.min(ind, s._skillCmds.length - 1);
            return s._skillCmds[ind].canUseList;
        };
        GameRole.prototype.operSkill = function (target, dir) {
            var s = this;
            s.skillCfg = ly.Conf.getSkill(target.skillID);
            var isCrit = target.hitType == 2;
            var mp = target.mp;
            if (mp != null && mp != s._mp) {
                s.addMp(mp - s._mp, isCrit);
            }
            var sp = target.curSp;
            if (sp > -1 && sp != s._sp) {
                s.addSp(sp - s._sp, isCrit);
            }
            if (s.skillCfg == null) {
                Log.writeLog("玩家" + s.getRoleName() + ",pos:" + s.pos + ",camp:" + s._camp + ",不存在此技能" + target.skillID, Log.WARN);
                return false;
            }
            if (s.skillCfg.skillActionType == 6)
                return false;
            if (s.skillCfg.skillActionType == 5)
                return false;
            s._dataType = target.dataType;
            if (s._dataType == 7)
                return true;
            if (s._skillUseDict[target.skillID] == null) {
                s._skillUseDict[target.skillID] = {
                    skillID: target.skillID,
                };
            }
            var skillObj;
            if (s.skillCfg.skillActionType == 10)
                s.setSkillCopyTool(10, 1);
            else if (s.skillCfg.skillActionType == 7)
                s.setSkillCopyTool(10, 0);
            skillObj = s._skillUseDict[target.skillID];
            skillObj.lastUseRound = target.round;
            skillObj.nextUseRound = target.round + s.skillCfg.cd;
            s.hitTime = s.skillCfg.hitTime ? s.skillCfg.hitTime : NaN;
            s.multiHurt = s.skillCfg.multiHurt == 1 ? true : false;
            s.attackMode = s.skillCfg.attackMode == 0 ? ly.AttackMode.NEAR : ly.AttackMode.FAR;
            s._nextInterval = s.skillCfg.duration ? s.skillCfg.duration : 1500;
            var bullet, full, espo, hit;
            full = s.effectGet(ly.EffectType.FULL);
            if (ly_set.SettingModel.instance.aniPlayEnabled())
                full.setConfig(s.skillCfg);
            espo = s.effectGet(ly.EffectType.ESPO);
            espo.setConfig(s.skillCfg);
            s.effectGet(ly.EffectType.ENVIR).setConfig(s.skillCfg);
            bullet = s.effectGet(ly.EffectType.BULLET);
            bullet.setConfig(s.skillCfg);
            if (bullet.hasEffectCfg)
                s.hitTime = NaN;
            if (target.dataType != 4) {
                hit = s.effectGet(ly.EffectType.SINGLE);
                hit.setConfig(s.skillCfg);
                target.role.effectGet(ly.EffectType.SINGLE).hasEffect = hit.hasEffectCfg;
            }
            if (target && target.mainTarget && s.skillCfg.skillName && (s.skillCfg.battleCommandType == 2 || s.skillCfg.battleCommandType == 9 || s.skillCfg.battleCommandType == 3 || s.skillCfg.battleCommandType == 10)) {
                modules.n_notice.SysNotiMgr.ins.addSceneCallSkill(s, s.skillCfg.skillId, s._showMap, true);
            }
            if (full.hasEffectCfg && espo.hasEffectCfg && !full.roundEnd) {
                s.effectCallBack = s.operFullScreenEffect;
                s.effectArgArray = [target, dir];
                espo.addEffect(s._scene.timeTick);
            }
            else {
                s.effectCallBack = null;
                s.operFullScreenEffect(target, dir);
            }
            return true;
        };
        GameRole.prototype.hasHitTime = function () {
            return this.skillCfg && this.skillCfg.hitTime > 0;
        };
        GameRole.prototype.hasNumShowtime = function () {
            return this.skillCfg && this.skillCfg.delayTime6 > 0;
        };
        GameRole.prototype.operFullScreenEffect = function (target, dir) {
            var s = this;
            var effect = s.effectGet(ly.EffectType.FULL);
            if (effect.hasEffectCfg && !effect.roundEnd) {
                effect.roundEnd = true;
                s.effectCallBack = s.operSkillFunc;
                s.effectArgArray = [target, dir];
                effect.addEffect(s._scene.timeTick);
            }
            else {
                s.effectCallBack = null;
                s.operSkillFunc(target, dir);
            }
        };
        GameRole.prototype.operSkillFunc = function (target, dir) {
            var s = this;
            if (s.attackMode == ly.AttackMode.NEAR && target) {
                s.moveToTargetAndAttack(target, s.skillCfg.sts);
            }
            else {
                if (target.protectorId > 0) {
                    var r = s._scene.findMonsterById(target.protectorId);
                    target.role.guardian = r;
                    if (r)
                        r.moveToProtect(target.role);
                }
                s.setOperSts(s.skillCfg.sts, dir);
            }
        };
        GameRole.prototype.getSkillCDRound = function (skillID) {
            var s = this;
            if (s._skillUseDict[skillID])
                return s._skillUseDict[skillID].nextUseRound;
            return s._scene.sceneLogic.getSceneData().round;
        };
        GameRole.prototype.setSkillCopyTool = function (skillActionType, state) {
            var s = this;
            var len;
            len = s._skillList.length;
            while (--len > -1) {
                if (s._skillList[len].skillActionType == skillActionType)
                    s._skillList[len].state = state;
            }
            return null;
        };
        GameRole.prototype.isRoundOperEnd = function () {
            var s = this;
            if (s._lockTarget && !ly.StsType.isActonEnd(s._lockTarget.role.sts))
                return false;
            return s._lastOperTime != s._lastOperTime && !s._targetMove;
        };
        GameRole.prototype.resetTargetData = function () {
            var s = this;
            s._attackRole = null;
            s._attackTargetData = null;
        };
        GameRole.prototype.setDamage = function (damageSts, damageEffect, attackRole, targetData, actionCfg) {
            if (damageSts === void 0) { damageSts = -1; }
            if (damageEffect === void 0) { damageEffect = null; }
            if (attackRole === void 0) { attackRole = null; }
            if (targetData === void 0) { targetData = null; }
            if (actionCfg === void 0) { actionCfg = null; }
            var s = this;
            s._attackRole = attackRole;
            s._attackTargetData = targetData;
            var hp;
            var stsChange;
            var lastSts;
            lastSts = s._sts;
            hp = Math.max(0, s._hp - targetData.realHurt) + targetData.heal;
            if (hp <= 0)
                s._isDead = true;
            if (s.calDamage(attackRole, targetData))
                s.resetTargetData();
            if (targetData.reboundHurt > 0) {
                if (attackRole._sts == ly.StsType.ATTACK)
                    attackRole.attackEndCheck();
                attackRole.setSts(damageSts, attackRole.direction, ly.StsType.devideActionSts(damageSts) ? actionCfg : null);
            }
            if (targetData.protectorHurt > 0 && s.guardian) {
                var r = s.guardian;
                s.guardian = null;
                if (r != null && !ly.StsType.cannotAction(r._sts)) {
                    r.isProtect = true;
                    damageSts = ly.StsType.getDamageSts(r);
                    r.setSts(damageSts, r.direction, ly.StsType.devideActionSts(damageSts) ? actionCfg : null);
                }
            }
            if (!ly.StsType.cannotAction(s._sts) && (targetData.realHurt > 0 || targetData.hurt > 0) && attackRole != s) {
                damageSts = ly.StsType.getDamageSts(s, s.isDefend && attackRole.skillCfg.skillAttackType == 1);
                s.setSts(damageSts, s._campObj.bornDir, ly.StsType.devideActionSts(damageSts) ? actionCfg : null);
                stsChange = true;
            }
            else if (targetData.hitType == 0) {
                s.setSts(s._skinPart.timeTicker._paused ? ly.StsType.STAND : ly.StsType.DODGE, s._campObj.bornDir);
                stsChange = true;
            }
            if (stsChange && ly.StsType.attackAction(lastSts))
                s.attackEndCheck();
            if (attackRole.skillCfg && attackRole.skillCfg.HitShake && attackRole.skillCfg.HitShake.length > 0) {
                var logic = s._scene.sceneLogic;
                logic && logic.addShake(attackRole.skillCfg.HitShake);
            }
            if (attackRole.skillCfg && attackRole.skillCfg.hitSound && attackRole.skillCfg.hitSound.length > 0) {
                var len = attackRole.skillCfg.hitSound.length;
                var name_32 = attackRole.skillCfg.hitSound[Math.floor(Math.random() * len)];
                modules.n_sound.SoundCtrl.instance.playSoundByName(name_32);
            }
            if (s._buffAtkEffect)
                s.addBuffAtkEffect(s._scene.timeTick);
        };
        GameRole.prototype.calDamage = function (attackRole, targetData) {
            var s = this;
            var isCrit, isMp;
            var hpType;
            if (attackRole == null || targetData == null)
                return true;
            isCrit = targetData.hitType == 2;
            if (s._damageMp) {
                var targetMp = targetData.targetMp;
                if (targetMp != null && targetMp != s._mp) {
                    s.addMp(targetMp - s._mp, isCrit);
                }
                s._damageMp = false;
            }
            if (s._targetSp) {
                var sp = targetData.sp;
                if (sp != -1 && sp != null && sp != s._sp) {
                    s.addSp(sp - s._sp, isCrit);
                }
                s._targetSp = false;
            }
            s.otherEffectExc(targetData.mpEffects);
            if (s.numShowTimeTicker.getPercent() >= 1) {
                s.numShowTimeTicker.clear();
                if (targetData.hitType == 0)
                    s.addFlowNumber(ly.RoleID.HP_NUM, "躲闪", 0, 0, ly.HPNUM_TYPE.OTHER);
                isMp = attackRole.skillCfg.skillAttackType == 2;
                hpType = ly.HPNUM_TYPE.COMMON;
                s.otherEffectExc(targetData.shieldEffects);
                if (targetData.realHurt != 0 || targetData.hurt != 0) {
                    if (s.showBossBigBar()) {
                        var logic = s._scene.sceneLogic;
                        logic.bossHurtMgr.removeData(targetData.fId, logic.getSceneData().round);
                    }
                    s.addHp(-targetData.realHurt, isCrit, hpType, s._scene.isWorldBossDungeon(), -targetData.hurt);
                }
                if (targetData.heal > 0)
                    s.addHp(targetData.heal, isCrit, ly.HPNUM_TYPE.HEAL);
                if (targetData.suck > 0)
                    attackRole.addHp(targetData.suck, false, ly.HPNUM_TYPE.SUCK);
                if (targetData.costHp > 0)
                    attackRole.addHp(-targetData.costHp, false, ly.HPNUM_TYPE.COMMON);
                if (targetData.reboundHurt > 0) {
                    s.addFlowNumber(ly.RoleID.HP_NUM, "反震", 0, 0, ly.HPNUM_TYPE.REBOUND);
                    attackRole.addHp(-targetData.realReboundHurt, false, ly.HPNUM_TYPE.REDUCE, false, -targetData.reboundHurt);
                }
                if (targetData.protectorHurt > 0 && s.guardian) {
                    var r = s.guardian;
                    if (r != null && !ly.StsType.cannotAction(r._sts)) {
                        r.isProtect = true;
                        r.addHp(-targetData.protectorHurt, isCrit, hpType);
                        r.addHp(targetData.protectHeal, isCrit, hpType);
                    }
                }
                if (s._isDead)
                    s._skinPart.continue();
                return true;
            }
            return false;
        };
        GameRole.prototype.attackEndCheck = function () {
            var s = this;
            var t;
            var bullet, envir;
            t = s._scene.timeTick;
            bullet = s.effectGet(ly.EffectType.BULLET);
            if (bullet.hasEffectCfg) {
                if (!bullet.hasDelayTime() && bullet.needShowEffect())
                    bullet.addEffect(t, null, 0, s._owner.getBulletTargets());
            }
            else {
                if (!s.effectGet(ly.EffectType.SINGLE).hasDelayTime() && s._lockTarget && s._lockTarget.role.effectGet(ly.EffectType.SINGLE).needShowEffect())
                    s.addHitEffectToTarget(t);
                if (!s.hasHitTime()) {
                    s.excHit();
                }
            }
            envir = s.effectGet(ly.EffectType.ENVIR);
            if (envir.needShowEffect() && !envir.hasDelayTime())
                envir.addEffect(t);
        };
        GameRole.prototype.moveToDel = function () {
            var s = this;
            var abX, abY;
            var fromX, fromY;
            if (s._targetMove)
                return;
            fromX = s._absX;
            fromY = s._absY;
            if (s.getBornDir() == ly.DirectionType.RIGHT)
                abX = s._scene._mapX;
            else
                abX = s._scene._mapX + s._scene.sceneWidth;
            abY = s._scene.mapY + (s._scene.sceneHeight * 0.3 + s._scene.sceneHeight * 0.3 * Math.random() | 0);
            s.moveTo(abX, abY, function () {
                abY = fromY > abY ? s._scene.mapY : (s._scene.mapY + s._scene.sceneHeight);
                abX = s._scene._mapX + (s._scene.sceneWidth * Math.random() | 0);
                s.moveTo(abX, abY, function () {
                    if (s.getBornDir() == ly.DirectionType.RIGHT)
                        abX = s._scene._mapX + s._scene.sceneWidth;
                    else
                        abX = s._scene._mapX;
                    abY = s._scene.mapY + (s._scene.sceneHeight * 0.3 + s._scene.sceneHeight * 0.3 * Math.random() | 0);
                    s.moveTo(abX, abY, function () {
                        s.del();
                    }, s, -1, 200, true, -1, -1, false);
                }, s, -1, 540, true, -1, -1, false);
            }, s, -1, 200, true, -1, -1, false);
        };
        GameRole.prototype.moveIn = function (absX, absY, moveIn) {
            if (moveIn === void 0) { moveIn = false; }
            var s = this;
            if (s.isDel())
                return;
            if (moveIn) {
                s.moveTo(absX, absY, null, s, ly.StsType.BORN, 500, false, s.getBornDir());
            }
            else
                s.setSts(s._camp == s._scene.sceneLogic.getMyCamp() ? ly.StsType.BORN : ly.StsType.SKILL_0, s.getBornDir());
        };
        GameRole.prototype.moveToTargetAndAttack = function (target, sts) {
            var s = this;
            var add;
            if (s._targetMove)
                return;
            if (s._operSts != -1)
                return;
            if (target.role == null || target.role == s)
                s.setOperSts(sts, s.getBornDir());
            else {
                var dir_1;
                dir_1 = target.role.getEnemyDir();
                add = s.getNearAttackDis();
                if (target.protectorId > 0) {
                    add *= 2;
                    var r = s._scene.findMonsterById(target.protectorId);
                    target.role.guardian = r;
                    if (r)
                        r.moveToProtect(target.role);
                }
                if (target.role._absX + add == s._absX && target.role._absY == s._absY)
                    s.setOperSts(sts, dir_1);
                else
                    s.moveTo(target.role._absX + add, target.role._absY, function () {
                        s.setOperSts(sts, dir_1);
                    }, s, ly.StsType.FIGHT_STAND, 180, false, s.getBornDir());
            }
        };
        GameRole.prototype.moveToProtect = function (protectedRole) {
            var s = this;
            var add;
            if (s._targetMove)
                return;
            if (s._operSts != -1)
                return;
            if (protectedRole == null || protectedRole == s)
                return;
            var dir;
            dir = protectedRole.getBornDir();
            add = -protectedRole.getProtectDis();
            if (protectedRole._absX + add == s._absX && protectedRole._absY == s._absY)
                s.setOperSts(s._scene.getSceneStandSts(), dir);
            else
                s.moveTo(protectedRole._absX + add, protectedRole._absY, function () {
                    s.setOperSts(s._scene.getSceneStandSts(), dir);
                }, s);
        };
        GameRole.prototype.moveBack = function (callBack, thisObj) {
            if (callBack === void 0) { callBack = null; }
            if (thisObj === void 0) { thisObj = null; }
            var s = this;
            if (s._targetMove || s._operSts != -1 || ly.StsType.cannotAction(s._sts)) {
                if (callBack != null)
                    callBack.call(thisObj, false);
                return false;
            }
            if (s._bornX != s._absX || s._bornY != s._absY) {
                s.setSts(s._scene.getSceneStandSts(), s.getBornDir());
                s.moveTo(s._bornX, s._bornY, function () {
                    s.setSts(s._scene.getSceneStandSts(), s._campObj.bornDir);
                    if (callBack != null)
                        callBack.call(thisObj, true);
                }, s, -1);
                return true;
            }
            else {
                if (callBack != null)
                    callBack.call(thisObj, true);
                return false;
            }
        };
        GameRole.prototype.getNearAttackDis = function () {
            var s = this;
            if (s._campObj.nearAttackDis)
                return s._campObj.nearAttackDis;
            return s._camp == 1 ? 150 : -150;
        };
        GameRole.prototype.getProtectDis = function () {
            var s = this;
            if (s._campObj.protectDis)
                return s._campObj.protectDis;
            return s._camp == 1 ? 100 : -100;
        };
        GameRole.prototype.getEnemyDir = function () {
            var s = this;
            return s._campObj ? (s._campObj.bornDir + 4) % 8 : ly.DirectionType.LEFT;
        };
        GameRole.prototype.removeTarget = function (target) {
            if (target === void 0) { target = null; }
            var s = this;
            if (s._targetRoles) {
                var ind = void 0, len = void 0;
                if (target == null) {
                    s._targetRoles.length = 0;
                    s._lockTarget = null;
                }
                else {
                    ind = s._targetRoles.indexOf(target);
                    if (ind > -1) {
                        if (s._targetRoles[ind] == s._lockTarget)
                            s._lockTarget = null;
                        s._targetRoles.splice(ind, 1);
                    }
                }
            }
        };
        GameRole.prototype.setTarget = function (targets) {
            var s = this;
            s._targetRoles = targets;
        };
        GameRole.prototype.getTarget = function (ind) {
            if (ind === void 0) { ind = 0; }
            var s = this;
            if (s._targetRoles == null)
                return null;
            if (s._targetRoles[ind] && s._targetRoles[ind].isInvalid()) {
                if (s._targetRoles[ind] == s._lockTarget)
                    s._lockTarget = null;
                s._targetRoles.splice(ind, 1);
                return null;
            }
            return s._targetRoles[ind];
        };
        GameRole.prototype.hasTarget = function () {
            var s = this;
            if (s._targetRoles) {
                var len = void 0;
                len = s._targetRoles.length;
                while (--len > -1) {
                    if (s._targetRoles[len].role)
                        return true;
                }
            }
            return s._lockTarget != null;
        };
        GameRole.prototype.hasNextTarget = function () {
            var s = this;
            return s._targetRoles && s._targetRoles.length > 1 && !this.multiHurt;
        };
        GameRole.prototype.hasNextCountRole = function () {
            var s = this;
            var len;
            var targetData;
            len = s._targetRoles ? s._targetRoles.length : 0;
            len = s.multiHurt ? len : (len > 0 ? 1 : 0);
            while (--len > -1) {
                targetData = s._targetRoles[len];
                if (targetData.countAtkTargetDatas == null)
                    continue;
                if (targetData != s._countAtkTarget && targetData.countAtkTargetDatas.length > 0)
                    return true;
                if (targetData == s._countAtkTarget && targetData.countAtkTargetDatas.length > 1)
                    return true;
            }
            return false;
        };
        GameRole.prototype.hasCounterAtkTarget = function () {
            var s = this;
            var flag;
            var len;
            var targetData;
            len = s._targetRoles ? s._targetRoles.length : 0;
            len = s.multiHurt ? len : (len > 0 ? 1 : 0);
            while (--len > -1) {
                targetData = s._targetRoles[len];
                if (targetData.countAtkTargetDatas && targetData.countAtkTargetDatas.length > 0) {
                    flag = true;
                    break;
                }
            }
            return s._countAtkTarget != null || flag;
        };
        GameRole.prototype.addHitEffectToTarget = function (startTime) {
            var s = this;
            if (s._lockTarget && s.skillCfg.hitEffect && s._lockTarget.dataType != 4) {
                var hitEffect = s.skillCfg.hitEffect.concat();
                if (s.multiHurt) {
                    var len = void 0;
                    len = s._targetRoles.length;
                    while (--len > -1)
                        s._targetRoles[len].role.effectGet(ly.EffectType.SINGLE).addEffect(startTime, hitEffect);
                }
                else {
                    s._lockTarget.role.effectGet(ly.EffectType.SINGLE).addEffect(startTime, hitEffect);
                }
            }
        };
        GameRole.prototype.getAllBuff = function () {
            return this._buffList;
        };
        GameRole.prototype.findBuffData = function (id) {
            var s = this;
            return s._buffList[this.findBuffIndex(id)];
        };
        GameRole.prototype.findBuffIndex = function (id) {
            var len;
            var s = this;
            len = s._buffList.length;
            while (--len > -1) {
                if (s._buffList[len].id == id)
                    return len;
            }
            return -1;
        };
        GameRole.prototype.addRoundObj = function (effectObj) {
            var s = this;
            if (s._myRoundObjs.indexOf(effectObj) == -1)
                s._myRoundObjs.push(effectObj);
        };
        GameRole.prototype.addCMDTip = function (id, camp) {
            var s = this;
            var tip;
            var len;
            var msg;
            len = s._myCMDTips.length;
            while (--len > -1) {
                if (s._myCMDTips[len]._id == id)
                    return;
            }
            var stringParam;
            stringParam = C.BlendNewCfg.ins.getCMDTips(camp);
            if (stringParam == null)
                return;
            msg = stringParam[id];
            tip = ly.SceneManager.instance.createNameObj(this, ly.RoleType.NAME_OBJ, camp == 1 ? ly.RoleID.BLUE_CMD : ly.RoleID.RED_CMD, camp == 1 ? 35 : -54, 0, 0, 0, msg);
            tip.setIdFromServer(camp * 10000 + id);
            s._myCMDTips.push(tip);
        };
        GameRole.prototype.getCMDTips = function () {
            return this._myCMDTips;
        };
        GameRole.prototype.removeRoundObj = function (effectObj) {
            var ind;
            var s = this;
            ind = s._myRoundObjs.indexOf(effectObj);
            if (ind > -1) {
                s._myRoundObjs.splice(ind, 1);
            }
        };
        GameRole.prototype.removeCMDTip = function (id, camp) {
            var s = this;
            var len;
            id = camp * 10000 + id;
            len = s._myCMDTips.length;
            while (--len > -1) {
                if (s._myCMDTips[len]._id == id) {
                    s._myCMDTips[len].del();
                    s._myCMDTips.splice(len, 1);
                }
            }
        };
        GameRole.prototype.clearCMDTip = function () {
            var s = this;
            var len;
            len = s._myCMDTips.length;
            while (--len > -1)
                s._myCMDTips[len].del();
            s._myCMDTips.length = 0;
        };
        GameRole.prototype.checkRoundObj = function (effectType) {
            var s = this;
            for (var _i = 0, _a = s._myRoundObjs; _i < _a.length; _i++) {
                var effectObj = _a[_i];
                if (effectObj.effectType == effectType && !effectObj.isDel()) {
                    return true;
                }
            }
            return false;
        };
        GameRole.prototype.addBuff = function (id, buffId, endRound) {
            if (buffId === void 0) { buffId = NaN; }
            if (endRound === void 0) { endRound = 1; }
            var s = this;
            var buffInd;
            buffInd = s.findBuffIndex(id);
            if (buffInd > -1) {
                return s._buffList[buffInd];
            }
            var buffData;
            var buffCfg;
            var buffEffectCfg;
            buffCfg = ly.Cfg_buff.ins.getBuffById(buffId);
            buffEffectCfg = ly.Cfg_buff.ins.getEffectByBuffId(buffId);
            buffData = {
                id: id,
                effective: false,
                buffCfg: buffCfg,
                endRound: endRound
            };
            s._buffList.push(buffData);
            s.setBuffBar();
            if (buffId == buffId) {
                var buff = void 0;
                var bt = s._scene.timeTick;
                if (buffEffectCfg) {
                    buff = {
                        effects: (buffEffectCfg.concat()).reverse(),
                        buffData: buffData,
                        id: id,
                        bornTime: bt
                    };
                    buff.effects.timeTicker = (new ly.TimeTicker(s._scene)).init(buff.bornTime, NaN);
                    s._buffEffects.push(buff);
                }
                buffEffectCfg = ly.Cfg_buff.ins.getAtkEffectByBuffId(buffId);
                if (buffEffectCfg) {
                    s._buffAtkEffect = {
                        effects: (buffEffectCfg.concat()).reverse(),
                        buffData: buffData,
                        id: id,
                        bornTime: NaN
                    };
                }
                var i = void 0, len = void 0;
                len = buffCfg.tips.length;
                for (i = 0; i < len; ++i) {
                    if (buffCfg.tips[i].length > 1)
                        s.addFlowNumber(ly.RoleID.HP_NUM, buffCfg.tips[i]);
                }
            }
            return buffData;
        };
        GameRole.prototype.getDefendSts = function () {
            var len;
            var s = this;
            var sts;
            len - s._buffList.length;
            while (--len > -1) {
                sts = s._buffList[len].buffCfg.attackedActive;
                if (sts > 0)
                    return sts;
            }
            return ly.StsType.DEFEND;
        };
        Object.defineProperty(GameRole.prototype, "canIgnoreRevive", {
            get: function () {
                return this._ignoreRevive || this.buffValues[ly.BuffEType.IMMUNITY_REVIVE] > 0;
            },
            set: function (val) {
                this._ignoreRevive = val;
            },
            enumerable: true,
            configurable: true
        });
        GameRole.prototype.isAllEffectDel = function (checkTarget) {
            if (checkTarget === void 0) { checkTarget = true; }
            var s = this;
            if (checkTarget && s._lockTarget && s._lockTarget.role != s && !s._lockTarget.role.isAllEffectDel(false))
                return false;
            var len;
            len = s._myRoundObjs.length;
            if (len == 0)
                return true;
            while (--len > -1) {
                if (s._myRoundObjs[len]._clothes.loops == 0)
                    continue;
                break;
            }
            return len == -1;
        };
        GameRole.prototype.isNoneEffect = function () {
            var s = this;
            var len;
            len = s._effectDatas.length;
            while (--len > -1) {
                if (s._effectDatas[len].hasEffect)
                    return false;
            }
            if (s._lockTarget && (s._lockTarget.role.effectGet(ly.EffectType.SINGLE).hasEffect || s._lockTarget.role.numShowTimeTicker.running()))
                return false;
            return true;
        };
        GameRole.prototype.isActionEnd = function () {
            return this._storyId == -1 && ly.StsType.isActonEnd(this._sts);
        };
        GameRole.prototype.setHitStartTime = function (timeTick, numShowTime) {
            if (numShowTime === void 0) { numShowTime = 0; }
            var s = this;
            s._damageMp = true;
            s._targetSp = true;
            s.numShowTimeTicker.init(timeTick, numShowTime > 0 ? numShowTime : NaN);
            s._hitTimeTicker.init(timeTick, NaN);
        };
        GameRole.prototype.addBuffAtkEffect = function (t) {
            this._buffAtkEffect.effects.timeTicker = (new ly.TimeTicker(this._scene)).init(t, NaN);
        };
        GameRole.prototype.effectGet = function (effectType) {
            return this._effectDatas[effectType._id];
        };
        GameRole.prototype.clearEffectActionData = function () {
            var s = this;
            var len;
            len = s._effectDatas.length;
            while (--len > -1)
                s._effectDatas[len].clearActionData();
        };
        GameRole.prototype.clearRoundData = function () {
            var s = this;
            var len;
            len = s._effectDatas.length;
            while (--len > -1)
                s._effectDatas[len].clearRoundData();
            s.isDefend = false;
        };
        GameRole.prototype.clearEffectData = function () {
            var s = this;
            var len;
            if (!s._effectDatas)
                return;
            len = s._effectDatas.length;
            while (--len > -1)
                s._effectDatas[len].clear();
        };
        GameRole.prototype.actionEnd = function () { };
        GameRole.prototype.roundEnd = function () {
            var s = this;
            s.removeNumber();
        };
        GameRole.prototype.otherEffectExc = function (otherEffects) {
            var i, len;
            var otherEffect;
            var s = this;
            if (otherEffects == null)
                return;
            len = otherEffects.length;
            for (i = 0; i < len; ++i) {
                otherEffect = otherEffects[i];
                var m = s._scene.findMonsterById(otherEffects[i].fightId);
                if (m == null)
                    throw (new Error("给不存在的角色加OtherEffect,fightId:" + otherEffect.fightId + ",type:" + otherEffect.type));
                if (otherEffect.type == 1) {
                    if (otherEffects[i].value > 0)
                        m.setHp(m._hp, NaN, m._shieldHp + otherEffects[i].value, false);
                    else if (otherEffects[i].value < 0)
                        m.addShieldHp(otherEffects[i].value);
                }
                else if (otherEffect.type == 2) {
                    m.addMp(otherEffect.value, false);
                }
            }
        };
        GameRole.prototype.excCountAtk = function () {
            var s = this;
            var i, len;
            var targetData;
            var fId;
            var effectDelFlag;
            var countRole;
            if (s._countAtkTarget == null) {
                effectDelFlag = s.isAllEffectDel();
                len = s.multiHurt ? s._targetRoles.length : 1;
                for (i = 0; i < len; ++i) {
                    targetData = s._targetRoles[i];
                    if (targetData.countAtkTargetDatas && targetData.countAtkTargetDatas.length > 0) {
                        fId = targetData.countAtkTargetDatas[0].fId;
                        if ((!s.isMyTarget(fId) || effectDelFlag)) {
                            countRole = s._scene.findMonsterById(fId);
                            if (countRole == null)
                                throw (new Error("不存在的反击执行角色, id:" + fId));
                            s._countAtkTarget = targetData;
                            s._countAtkTarget.countRole = countRole;
                            s._countAtkTarget.countRoleId = countRole.poolId;
                            countRole.setTarget([s._countAtkTarget.countAtkTargetDatas[0]]);
                            break;
                        }
                    }
                }
            }
        };
        GameRole.prototype.isMyTarget = function (tId) {
            var s = this;
            var len;
            if (s._lockTarget) {
                if (s.multiHurt) {
                    len = s._targetRoles.length;
                    while (--len > -1) {
                        if (s._targetRoles[len].tId == tId)
                            return true;
                    }
                }
                else {
                    if (s._lockTarget.tId == tId)
                        return true;
                }
            }
            return false;
        };
        GameRole.prototype.setPlayerCmdTip = function (msg, time) {
            if (time === void 0) { time = NaN; }
            var s = this;
            s.setTip(msg, msg == null ? null : ly.RoleID.CMD_TIP);
            s._closeCmdTipTime = s._scene.timeTick + time;
        };
        GameRole.prototype.excCall = function () { };
        GameRole.prototype.excHit = function () { };
        GameRole.prototype.setDamageByTargetData = function (targetData) { ++targetData.hitCount; };
        GameRole.prototype.createMulEffect = function (effectCfg, type, groupId, buffData) {
            if (type === void 0) { type = null; }
            if (groupId === void 0) { groupId = -1; }
            if (buffData === void 0) { buffData = null; }
            var s = this;
            var len, t;
            var effect;
            t = effectCfg.timeTicker == null ? Number.MAX_VALUE : effectCfg.timeTicker.getCurTime();
            len = effectCfg.length;
            while (--len > -1) {
                effect = effectCfg[len];
                if (effect.time >= 0) {
                    if (t >= effect.time) {
                        s.createEffect(effect.id, effect.layer, effect.offsetX, effect.offsetY, type, groupId, effectCfg.atkData, effect.notDir, buffData);
                        effectCfg.splice(len, 1);
                    }
                }
                else
                    effectCfg.splice(len, 1);
            }
        };
        GameRole.prototype.createEffect = function (effectID, layerType, offsetX, offsetY, type, groupId, atkData, notDir, buffData) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            if (type === void 0) { type = null; }
            if (groupId === void 0) { groupId = -1; }
            if (atkData === void 0) { atkData = null; }
            if (notDir === void 0) { notDir = 0; }
            if (buffData === void 0) { buffData = null; }
            var s = this;
            var effectCfg;
            var cx, cy, n;
            var dir, damagePosX, damagePosY;
            type = type == null ? ly.EffectType.SINGLE : type;
            effectCfg = ly.RoleConfig.getEffectObj(effectID, layerType);
            if (type == ly.EffectType.BULLET) {
                dir = s.getBornDir();
                damagePosX = offsetX;
                damagePosY = s._headJumpH * 0.6 - offsetY;
                var driftObj = void 0;
                driftObj = s._scene.createEffectToScene(s, effectID, s._absX + damagePosX, s._absY + 1, type, groupId, dir, damagePosY);
                driftObj.setTarget([atkData]);
                driftObj.setAttackTarPos(atkData.role._bornX + damagePosX, atkData.role._bornY);
                s.addRoundObj(driftObj);
                return;
            }
            dir = s.getBornDir();
            if (notDir == 2)
                dir = ly.DirectionType.UP;
            else
                dir = notDir > 0 ? dir : (dir + 4) % 8;
            if (type == ly.EffectType.BUFF) {
                var buffEffect = void 0;
                buffEffect = s.findBuffEffect(effectID);
                if (buffEffect) {
                    if (buffEffect._isBuffDataBind && buffData.effect == null)
                        buffEffect.addBuffData(buffData);
                    return;
                }
            }
            if (effectCfg.layerType == ly.LayerType.SCENE_EFFECT_TOP || effectCfg.layerType == ly.LayerType.FLOOR) {
                cx = s._scene._mapX + (s._scene.sceneWidth >> 1);
                cy = s._scene._mapY + (s._scene.sceneHeight >> 1);
                n = s._camp == 1 ? 1 : -1;
                damagePosX = cx + ((s._clothesRate.damagePos ? s._clothesRate.damagePos[0] : 0) + offsetX) * n;
                damagePosY = cy + ((s._clothesRate.damagePos ? s._clothesRate.damagePos[1] : 0) + offsetY);
            }
            else if (effectCfg.layerType == ly.LayerType.SCENE_UI_TOP) {
                n = s._camp == 1 ? 1 : -1;
                damagePosX = s._scene._mapX + (s._scene.sceneWidth >> 1) + offsetX * n;
                damagePosY = s._scene._mapY + (s._scene.sceneHeight >> 1) + offsetY;
            }
            else {
                damagePosX = 0 - offsetX;
                damagePosY = (offsetY == 0 && type == ly.EffectType.SINGLE) ? -s._headH * 0.5 : offsetY;
            }
            var effectObj;
            var o;
            if (atkData)
                o = atkData.tId == s._id ? s : s._scene.findElementById(atkData.tId, -1);
            else
                o = s;
            effectObj = s._scene.createEffectToScene(o, effectID, damagePosX, damagePosY, type, groupId, dir, damagePosY);
            if (s.effectCallBack != null && (type == ly.EffectType.FULL || type == ly.EffectType.ESPO)) {
                effectObj.removeHandler = Handler.create(s, s.effectCallBack, s.effectArgArray);
            }
            if (type == ly.EffectType.BUFF) {
                if (buffData.effect == null)
                    effectObj.addBuffData(buffData);
            }
            else
                o.addRoundObj(effectObj);
            return effectObj;
        };
        GameRole.prototype.hasStatusBuff = function (buffStatus) {
            if (buffStatus === void 0) { buffStatus = 3; }
            var len;
            var s = this;
            len = s._buffList.length;
            while (--len > -1) {
                if (s._buffList[len].buffCfg.skillActionStatusCode == buffStatus)
                    return true;
            }
            return false;
        };
        GameRole.prototype.setBuffBar = function () {
            var s = this;
            if (s.hpEffect) {
                var arr = this._buffList.concat([]);
                if (arr.length >= 5) {
                    arr.splice(3, 1, this.createDemoBuffData());
                }
                s.hpEffect.setBuffs(arr);
            }
        };
        GameRole.prototype.createDemoBuffData = function () {
            var s = this;
            var buffCfg;
            var buffData;
            buffData = ly.MMOBuffLogic.createMMOBuffData(-1, s, null, null);
            return buffData;
        };
        GameRole.prototype.updateShowEnter = function () {
            var s = this;
            var dis = s.distanceToLeaderRole();
            var blendCfg = C.BlendNewCfg.ins.getCfgById(2701);
            var limitDis = blendCfg && blendCfg.intParam[0] || 400;
            s._showEnter = dis <= limitDis;
        };
        GameRole.prototype.showEnterVisible = function (tween) {
            if (tween === void 0) { tween = false; }
            var s = this;
            var value = s._visible && s._showEnter;
            if (s.funcBtn)
                s.funcBtn.visible = value;
        };
        GameRole.prototype.showFuncBtn = function (funcType) {
            var s = this;
            if (s._funcId && C.FuncOpenNewCfg.ins.hidden(s._funcId)) {
                return;
            }
            if (funcType)
                s.funcType = funcType;
            if (s.funcBtn == null)
                s.funcBtn = new ly.FunctionBtn(s);
            if (s.funcBtn.parent == null)
                LayerManager.ins.sceneUITopLay.addChild(s.funcBtn);
            s.funcBtn.alpha = 1;
            s.funcBtn.name = "btn_" + s.cfg.id + "_" + s._roleID;
            if (s.funcType == ly.FunctionType.SENDER || s.funcType == ly.FunctionType.SENDER_BACK) {
                s.funcBtn.setBtnSkin(ly.FunctionType.SENDER);
            }
            else if (s.funcType == ly.FunctionType.BOX) {
                s.funcBtn.setBtnSkin(ly.FunctionType.BOX);
            }
            else if (s.funcType == ly.FunctionType.TRANSFER || s.funcType == ly.FunctionType.TRANSFER_MAP || s.funcType == ly.FunctionType.DUNGEON) {
                s.funcBtn.setBtnSkin(ly.FunctionType.TRANSFER);
            }
            else if (s.funcType == ly.FunctionType.CAMPSITE) {
                s.funcBtn.setBtnSkin(ly.FunctionType.CAMPSITE);
            }
            else if (s.funcType == ly.FunctionType.EXPLORE || s.funcType == ly.FunctionType.EXPLORE_BOSS) {
                s.funcBtn.setBtnSkin(ly.FunctionType.EXPLORE);
            }
            else {
                s.funcBtn.initBtnSkin();
            }
        };
        GameRole.prototype.hideFuncBtn = function () {
            var s = this;
            if (s.funcBtn == null)
                return;
            if (s.funcBtn.parent)
                LayerManager.ins.sceneUITopLay.removeChild(s.funcBtn);
        };
        GameRole.Default_ClkRect = new Laya.Rectangle(-40, -150, 80, 150);
        GameRole.VISIBLE_DEL_INTERVAL = 2000;
        GameRole.NEW_HANG_PATROL_INTERVAL = 3000;
        GameRole.NEW_HANG_PATROLENEMY_INTERVAL = 500;
        GameRole.HANG_SMART_INTERVAL = 200;
        GameRole.HANG_PATH_INTERVAL = 200;
        return GameRole;
    }(ly.AniRole));
    ly.GameRole = GameRole;
})(ly || (ly = {}));
