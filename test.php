<?php

function trace($value = '[info]'){
	static $_info = array();
	if($value === '[info]'){
		return $_info;
	}else{
		$_info = $value;
	}

}


trace(array(1,2,3,4));
print_r(trace());
