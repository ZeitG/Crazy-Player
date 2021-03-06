/**
 * empty basic vertex shader
 */

attribute vec3 a_position;

//the color of the point
attribute vec3 a_color;

varying vec3 v_color;

uniform mat4 u_modelView;
uniform mat4 u_projection;


//like a C program main is the main function
void main() {
  gl_Position = u_projection * u_modelView * vec4(a_position,1) ;
  a_color;
  v_color = vec3(0.7,0,0);
}
