<?php





/** Set ABSPATH for execution */

define('ABSPATH', dirname(dirname(__FILE__)) . '/');

define('WPINC', 'wp-includes');





/**

 * @ignore

 */

function add_filter()

{

}



/**

 * @ignore

 */

function esc_attr($str)

{

    return $str;

}



/**

 * @ignore

 */

function apply_filters()

{

}



/**

 * @ignore

 */

function get_option()

{

}



/**

 * @ignore

 */

function is_lighttpd_before_150()

{

}



/**

 * @ignore

 */

function add_action()

{

}



/**

 * @ignore

 */

function did_action()

{

}



/**

 * @ignore

 */

function do_action_ref_array()

{

}



/**

 * @ignore

 */

function get_bloginfo()

{

}



/**

 * @ignore

 */

function is_admin()

{

    return true;

}



/**

 * @ignore

 */

function site_url()

{

}



/**

 * @ignore

 */

function admin_url()

{

}



/**

 * @ignore

 */

function home_url()

{

}



/**

 * @ignore

 */

function includes_url()

{

}



/**

 * @ignore

 */

function wp_guess_url()

{

}



if (! function_exists('json_encode')) :

/**

 * @ignore

 */

function json_encode()

{

}

endif;







/* Convert hexdec color string to rgb(a) string */



function hex2rgba($color, $opacity = false)

{

    $default = 'rgb(0,0,0)';



    //Return default if no color provided

    if (empty($color)) {

        return $default;

    }



    //Sanitize $color if "#" is provided

    if ($color[0] == '#') {

        $color = substr($color, 1);

    }



    //Check if color has 6 or 3 characters and get values

    if (strlen($color) == 6) {

        $hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );

    } elseif (strlen($color) == 3) {

        $hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );

    } else {

        return $default;

    }



    //Convert hexadec to rgb

    $rgb =  array_map('hexdec', $hex);



    //Check if opacity is set(rgba or rgb)

    if ($opacity) {

        if (abs($opacity) > 1) {

            $opacity = 1.0;

        }

        $output = 'rgba('.implode(",", $rgb).','.$opacity.')';

    } else {

        $output = 'rgb('.implode(",", $rgb).')';

    }



    //Return rgb(a) color string

    return $output;

}

$main_color = $_GET['main_color'];

$second_color = $_GET['second_color'];

$third_color = $_GET['third_color'];

$text_color = $_GET['text_color'];

$heading_color = $_GET['heading_color'];



ob_start(); ?>



:root{

	--theme-color: #<?php echo esc_attr($main_color); ?>;

	--theme-color-2: #<?php echo esc_attr($second_color); ?>;

    --secondary-color: #<?php echo esc_attr($third_color); ?>;

    --text-color: #<?php echo esc_attr($text_color); ?>;

    --title-color: #<?php echo esc_attr($heading_color); ?>;

}







<?php



$out = ob_get_clean();

$expires_offset = 31536000; // 1 year

header('Content-Type: text/css; charset=UTF-8');

header('Expires: ' . gmdate("D, d M Y H:i:s", time() + $expires_offset) . ' GMT');

header("Cache-Control: public, max-age=$expires_offset");

header('Vary: Accept-Encoding'); // Handle proxies

header('Content-Encoding: gzip');



echo gzencode($out);

exit;

