<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2013 http://topthink.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
namespace Think;
/**
 * ThinkPHP系统钩子实现
 */
class Hook {

    static private  $tags       =   array();

    /**
     * 动态添加插件（行为）到某个标签位
     * @param string $tag 标签名称
     * @param mixed $name 插件名称
     * @return void
     */
    static public function add($tag,$name) {
        // 如果还不存在 $tag 标签位就初始化该标签位
        if(!isset(self::$tags[$tag])){
            self::$tags[$tag]   =   array();
        }        
        if(is_array($name)){
            // 如果一次添加多个行为，用数组合并的形式
            self::$tags[$tag]   =   array_merge(self::$tags[$tag],$name);
        }else{
            // 如果一次只添加一个行为，直接赋值
            self::$tags[$tag][] =   $name;
        }
    }

    /**
     * 批量导入插件
     * @param array $data 插件信息
     * @param boolean $recursive 是否递归合并
     * @return void
     */
    static public function import($data,$recursive=true) {
        if(!$recursive){ // 覆盖导入
            self::$tags   =   array_merge(self::$tags,$data);
        }else{ // 合并导入
            foreach ($data as $tag=>$val){
                if(!isset(self::$tags[$tag]))
                    self::$tags[$tag]   =   array();            
                if(!empty($val['_overlay'])){
                    // 可以针对某个标签指定覆盖模式
                    unset($val['_overlay']);
                    self::$tags[$tag]   =   $val;
                }else{
                    // 合并模式
                    self::$tags[$tag]   =   array_merge(self::$tags[$tag],$val);
                }
            }            
        }
    }

    /**
     * 获取插件信息
     * @param string $tag 插件位置 留空获取全部
     * @return array
     */
    static public function get($tag='') {
        if(empty($tag)){
            // 获取全部的插件信息
            return self::$tags;
        }else{
            return self::$tags[$tag];
        }
    }

    /**
     * 监听标签的插件（执行该标签位的所有行为）
     * @param string $tag 标签名称
     * @param mixed $params 传入参数
     * @return void
     */
    static public function listen($tag, &$params=NULL) {
        // 如果该标签位已经注册
        if(isset(self::$tags[$tag])) {
            if(APP_DEBUG) {
                G($tag.'Start'); // 开始标记位
                trace('[ '.$tag.' ] --START--','','INFO'); // trace信息
            }
            //循环该标签位的所有插件（行为）
            foreach (self::$tags[$tag] as $name) {
                APP_DEBUG && G($name.'_start'); //调试模式下记录当前行为开始标记位
                // 执行 $name 行为的 run方法，$params为run方法的参数
                $result =   self::exec($name, $tag,$params);
                if(APP_DEBUG){
                    G($name.'_end');//调试模式下记录当前行为结束标记位
                    trace('Run '.$name.' [ RunTime:'.G($name.'_start',$name.'_end',6).'s ]','','INFO');
                }
                if(false === $result) {
                    // 如果返回false 则中断插件执行
                    return ;
                }
            }
            if(APP_DEBUG) { // 记录行为的执行日志
                trace('[ '.$tag.' ] --END-- [ RunTime:'.G($tag.'Start',$tag.'End',6).'s ]','','INFO');
            }
        }
        return;
    }

    /**
     * 执行某个插件（行为）
     * @param string $name 插件名称
     * @param string $tag 方法名（标签名）     
     * @param Mixed $params 传入的参数
     * @return void
     */
    static public function exec($name, $tag,&$params=NULL) {
        if('Behavior' == substr($name,-8) ){
            // 行为扩展必须用run入口方法
            $tag    =   'run';
        }
        $addon   = new $name();
        return $addon->$tag($params);
    }
}