<?php

namespace Addons\Links;
use Common\Controller\Addon;

/**
 * 友情链接插件
 * @author 林武
 */

    class LinksAddon extends Addon{

        public $info = array(
            'name'=>'Links',
            'title'=>'友情链接',
            'description'=>'林武开发的OneThink友情链接插件',
            'status'=>1,
            'author'=>'林武',
            'version'=>'0.1'
        );

        public $admin_list = array(
            'model'=>'Example',		//要查的表
			'fields'=>'*',			//要查的字段
			'map'=>'',				//查询条件, 如果需要可以再插件类的构造方法里动态重置这个属性
			'order'=>'id desc',		//排序,
			'list_grid'=>array( 		//这里定义的是除了id序号外的表格里字段显示的表头名和模型一样支持函数和链接
                'cover_id|preview_pic:封面',
                'title:书名',
                'description:描述',
                'link_id|get_link:外链',
                'update_time|time_format:更新时间',
                'id:操作:[EDIT]|编辑,[DELETE]|删除'
            ),
        );

        public $custom_adminlist = 'links';

        public function install(){
            return true;
        }

        public function uninstall(){
            return true;
        }

        //实现的AdminIndex钩子方法
        public function AdminIndex($param){

        }

    }