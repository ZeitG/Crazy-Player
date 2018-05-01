var gl = null;
//our shader program
var shaderProgram = null;

var canvasWidth = 800;
var canvasHeight = 800;
var aspectRatio = canvasWidth / canvasHeight;

var context;

//------------player Variables--------------
var playerTransformationNode;
//------------------------------------------

//---------------------scenes---------------
var firstScene , secondScene;
var sceneCounter = 0;
//------------------------------------------

//---------- Playe Ground Variables --------
var playGroundTransformationNode;


//------------------------------------------

//---------- Platform in Room Variables ----
var platformTranformationNode;
var platformRotationAngle = 1,platformRotationAngleSpeed = 10;
var platformTranslationX =0,platformTranslationY = 0,platformTranslationZ = -0.1;
var platformScaleX = 0.4, platformScaleY=0.4, platformScaleZ=0.1;
//------------------------------------------

//-------- Kamera Variables-----------------
var cameraFree = true;
var cameraTranslationX = 0,cameraTranslationY = 0,cameraTranslationZ = 0 ,cameraTranslationSpeed = 1.2;
var cameraRotationAngle = 0 , cameraRotationAngleSpeed = 20;
//------------------------------------------

//----------Time Variable------------
var time = 0 , lastTime = 0 , deltaTime = 0;
//-----------------------------------

//----------Key Variables --------------
var isKeyPressing = false;
var key ;

function init(resources) {
    //create a GL context
    gl = createContext(canvasWidth /*width*/, canvasHeight /*height*/);
    initInteraction(gl.canvas);

    //compile and link shader program
    shaderProgram = createProgram(gl, resources.vs, resources.fs);

    initQuadBuffer();
    initCubeBuffer();

    firstScene = new SceneGraphNode();

    //--------- Room ----------------
    initRoom(firstScene,resources);
    initGroundPlatform(firstScene,resources);
    initPlayer(firstScene);


    secondScene = new SceneGraphNode();

    //--------- spiel platz----------
    initPlayGround(secondScene);
    //---------  player   -----------
    initPlayer(secondScene);
    //---------- Seats    -------------
    initSeats(secondScene);
    //-------- wall and Glass --------
    initWallAndWindow(secondScene,resources);
    //----------------------------------


}

function initInteraction(canvas) {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}



function handleKeyUp(event) {
    isKeyPressing = false;
}

function handleKeyDown(event) {
    isKeyPressing = true;
    key = event.keyCode || event.which || event.charCode;
}



function initGroundPlatform(scene,resources) {
    var groundTransformationMatrix = mat4.multiply(mat4.create(),mat4.create(),glm.rotateX(90));
    groundTransformationMatrix = mat4.multiply(mat4.create(),groundTransformationMatrix,glm.translate(0,-0.5,0));
    groundTransformationMatrix = mat4.multiply(mat4.create(),groundTransformationMatrix,glm.scale(0.75,0.75,0.75));
    var groundTransformationNode = new TransformationSceneGraphNode(groundTransformationMatrix);
    scene.append(groundTransformationNode);
    var ground = new QuadRenderNode();
    groundTransformationNode.append(ground);

    var platformTransformationMatrix = mat4.create();
    platformTransformationMatrix = mat4.multiply(mat4.create(),platformTransformationMatrix,glm.rotateZ(platformRotationAngle));
    platformTransformationMatrix = mat4.multiply(mat4.create(),platformTransformationMatrix,glm.translate(platformTranslationX,platformTranslationY,platformTranslationZ));
    platformTransformationMatrix = mat4.multiply(mat4.create(),platformTransformationMatrix,glm.scale(platformScaleX,platformScaleY,platformScaleZ));
    platformTranformationNode = new TransformationSceneGraphNode(platformTransformationMatrix);
    groundTransformationNode.append(platformTranformationNode);
    var platformShader = new ShaderSceneGraphNode(createProgram(gl,resources.platformvs,resources.platformfs));
    platformTranformationNode.append(platformShader);
    var platform = new CubeRenderNode();
    platformShader.append(platform);



}

function initRoom(scene,resources) {
    var roomTransformationMatrix = mat4.multiply(mat4.create(),mat4.create(),glm.translate(0,0,-0.5));
    var roomTransformationNode = new TransformationSceneGraphNode(roomTransformationMatrix);
    scene.append(roomTransformationNode);

    var roomTransformationShader = new ShaderSceneGraphNode(createProgram(gl,resources.wallBrownvs,resources.wallBrownfs));
    roomTransformationNode.append(roomTransformationShader);

    var wall1TransformationMatrix = mat4.create();
    wall1TransformationMatrix = mat4.multiply(mat4.create(),wall1TransformationMatrix,glm.translate(0,0.3,-0.75))
    wall1TransformationMatrix = mat4.multiply(mat4.create(),wall1TransformationMatrix,glm.scale(0.75,0.3,0.05));
    var wall1TransformationNode = new TransformationSceneGraphNode(wall1TransformationMatrix);
    roomTransformationShader.append(wall1TransformationNode);
    var wall1 = new CubeRenderNode();
    wall1TransformationNode.append(wall1);

    var wall2TransformationMatrix = mat4.create();
    wall2TransformationMatrix = mat4.multiply(mat4.create(),wall2TransformationMatrix,glm.rotateY(90));
    wall2TransformationMatrix = mat4.multiply(mat4.create(),wall2TransformationMatrix,glm.translate(0,0.3,-0.75));
    wall2TransformationMatrix = mat4.multiply(mat4.create(),wall2TransformationMatrix,glm.scale(0.75,0.3,0.05));
    var wall2TransformationNode = new TransformationSceneGraphNode(wall2TransformationMatrix);
    roomTransformationShader.append(wall2TransformationNode);
    var wall2 = new CubeRenderNode();
    wall2TransformationNode.append(wall2);


}

function initWallAndWindow(scene,resources) {

    var wallTransformationMatrix = mat4.multiply(mat4.create(),mat4.create(), glm.rotateY(90));
    wallTransformationMatrix = mat4.multiply(mat4.create(),wallTransformationMatrix,glm.translate(2.535,0.15,-0.75));
    wallTransformationMatrix = mat4.multiply(mat4.create(),wallTransformationMatrix,glm.scale(0.035,0.15,2.25));
    var wallTransformationNode= new TransformationSceneGraphNode(wallTransformationMatrix);
    scene.append(wallTransformationNode);
    var wall = new CubeRenderNode();
    wallTransformationNode.append(wall);

    var windowTransformationMatrix = mat4.multiply(mat4.create(),mat4.create(),glm.rotateY(-90));
    windowTransformationMatrix = mat4.multiply(mat4.create(),windowTransformationMatrix ,glm.translate(0,1.75,0));
    windowTransformationMatrix = mat4.multiply(mat4.create(),windowTransformationMatrix,glm.scale(1,0.75,1));
    var windowTransformationNode = new TransformationSceneGraphNode(windowTransformationMatrix);
    wallTransformationNode.append(windowTransformationNode);
    var windowTransformationShader = new ShaderSceneGraphNode(createProgram(gl,resources.windowvs,resources.windowfs));
    windowTransformationNode.append(windowTransformationShader);
    var window = new QuadRenderNode();
    windowTransformationShader.append(window);


}

function initSeats(scene) {
    var seatsTransformationMatrix = mat4.multiply(mat4.create(),mat4.create(),glm.translate(-2.5,0.05,-0.5));
    seatsTransformationMatrix = mat4.multiply(mat4.create(),seatsTransformationMatrix,glm.scale(0.5,0.05,2));
    var seatsTransformationNode = new TransformationSceneGraphNode(seatsTransformationMatrix);
    scene.append(seatsTransformationNode);

    var level0 = new CubeRenderNode();
    seatsTransformationNode.append(level0);

    var seatsTransformationLevel1Matrix = mat4.multiply(mat4.create(),mat4.create(),glm.translate(-0.25,2,0));
    seatsTransformationLevel1Matrix = mat4.multiply(mat4.create(),seatsTransformationLevel1Matrix,glm.scale(0.75,1,1));
    var seatsTransformationLevel1Node = new TransformationSceneGraphNode(seatsTransformationLevel1Matrix);
    seatsTransformationNode.append(seatsTransformationLevel1Node);
    var level1 = new CubeRenderNode();
    seatsTransformationLevel1Node.append(level1);

    var seatsTransformationLevel2Matrix = mat4.multiply(mat4.create(),mat4.create(),glm.translate(-0.5,4,0));
    seatsTransformationLevel2Matrix = mat4.multiply(mat4.create(),seatsTransformationLevel2Matrix,glm.scale(0.5,1,1));
    var seatsTransformationLevel2Node = new TransformationSceneGraphNode(seatsTransformationLevel2Matrix);
    seatsTransformationNode.append(seatsTransformationLevel2Node);
    var level2 = new CubeRenderNode();
    seatsTransformationLevel2Node.append(level2);
}

function initPlayGround(scene) {

    //!!länge von spielplatz = 4

    var playgroundTransformationMatrix = glm.rotateX(90);
    playgroundTransformationMatrix = mat4.multiply(mat4.create(),playgroundTransformationMatrix,glm.translate(0,-0.5,0));
    playgroundTransformationMatrix = mat4.multiply(mat4.create(),playgroundTransformationMatrix,glm.scale(2,2,2));

    playGroundTransformationNode = new TransformationSceneGraphNode(playgroundTransformationMatrix);
    scene.append(playGroundTransformationNode);

    var playground = new QuadRenderNode();
    playGroundTransformationNode.append(playground);

}


function initPlayer(scene) {
    var playerTransformationMatrix = mat4.multiply(mat4.create(), mat4.create(), glm.rotateY(0));
    playerTransformationMatrix = mat4.multiply(mat4.create(),playerTransformationMatrix,glm.translate(0,0.3,-0.5));
    playerTransformationMatrix = mat4.multiply(mat4.create(), playerTransformationMatrix, glm.rotateY(0));
    playerTransformationMatrix = mat4.multiply(mat4.create(),playerTransformationMatrix,glm.scale(0.05,0.05,0.02));
    playerTransformationNode = new TransformationSceneGraphNode(playerTransformationMatrix);
    scene.append(playerTransformationNode);


    var body = new CubeRenderNode();
    playerTransformationNode.append(body);

}


function render(timeInMilliseconds) {

    time = timeInMilliseconds / 1000;
    deltaTime = time - lastTime;

    if(!isNaN(deltaTime))
        platformRotationAngle = platformRotationAngle + (deltaTime * platformRotationAngleSpeed);

    //set background color to light gray
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    //clear the buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //enable depth test to let objects in front occluse objects further away
    gl.enable(gl.DEPTH_TEST);

    //TASK 1-1
    gl.enable(gl.BLEND);
    //TASK 1-2
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //activate this shader program
    gl.useProgram(shaderProgram);


    context = createSceneGraphContext(gl,shaderProgram);

    //if(time <10)
    //secondScene.render(context);

    firstScene.render(context);

    //console.log(platformRotationAngle);

    updatePlatform();

    var playerTransformationMatrix = mat4.multiply(mat4.create(), mat4.create(), glm.rotateY(0));
    playerTransformationMatrix = mat4.multiply(mat4.create(),playerTransformationMatrix,glm.translate(0,0.3,-0.5));
    playerTransformationMatrix = mat4.multiply(mat4.create(), playerTransformationMatrix, glm.rotateY(0));
    playerTransformationMatrix = mat4.multiply(mat4.create(),playerTransformationMatrix,glm.scale(0.05,0.05,0.02));
    playerTransformationNode.setMatrix(playerTransformationMatrix);


    requestAnimationFrame(render);
    lastTime = time;

}


function updatePlatform(){
    var platformTransformationMatrix = mat4.create();
    platformTransformationMatrix = mat4.multiply(mat4.create(),platformTransformationMatrix,glm.rotateZ(platformRotationAngle));
    platformTransformationMatrix = mat4.multiply(mat4.create(),platformTransformationMatrix,glm.translate(platformTranslationX,platformTranslationY,platformTranslationZ));
    platformTransformationMatrix = mat4.multiply(mat4.create(),platformTransformationMatrix,glm.scale(platformScaleX,platformScaleY,platformScaleZ));
    platformTranformationNode.setMatrix(platformTransformationMatrix);
}

//load the shader resources using a utility function
loadResources({
    vs: 'shader/crazy_player.vs.glsl',
    fs: 'shader/crazy_player.fs.glsl',
    windowvs:'shader/window_shadervs.vs.glsl',
    windowfs: 'shader/window_shaderfs.fs.glsl',
    wallBrownvs: 'shader/wall_brown_shadervs.vs.glsl',
    wallBrownfs: 'shader/wall_brown_shaderfs.fs.glsl',
    platformvs: 'shader/platform_shadervs.vs.glsl',
    platformfs: 'shader/platform_shaderfs.fs.glsl'
}).then(function (resources /*an object containing our keys with the loaded resources*/) {
    init(resources);

    //render one frame
    render();
});

function setUpModelViewMatrix(sceneMatrix, viewMatrix) {
    var modelViewMatrix = mat4.multiply(mat4.create(), viewMatrix, sceneMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(context.shader, 'u_modelView'), false, modelViewMatrix);
}

/**
 * returns a new rendering context
 * @param gl the gl context
 * @param projectionMatrix optional projection Matrix
 * @returns {ISceneGraphContext}
 */
function createSceneGraphContext(gl, shader) {

    //create a default projection matrix
    projectionMatrix = mat4.perspective(mat4.create(), convertDegreeToRadians(25), aspectRatio, 0.01, 10);
    //set projection matrix
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, 'u_projection'), false, projectionMatrix);

    return {
        gl: gl,
        sceneMatrix: mat4.create(),
        viewMatrix: !cameraFree ? calculateViewMatrix() : calculateViewFreeMatrix(),
        projectionMatrix: projectionMatrix,
        shader: shader
    };

}

function calculateViewFreeMatrix(){
    //compute the camera's matrix
    var eye = [0,3,5];
    var center = [0,0,0];
    var up = [0,1,0];
    viewMatrix = mat4.lookAt(mat4.create(), eye, center, up);

    if(isKeyPressing){
        if(key == 40){
            cameraTranslationX = cameraTranslationX + (deltaTime * cameraTranslationSpeed );
        }
        else if(key == 38){
            cameraTranslationX = cameraTranslationX - (deltaTime * cameraTranslationSpeed );
        }
        //-->
        else if(key == 39){
            cameraRotationAngle = cameraRotationAngle - (deltaTime * cameraRotationAngleSpeed);
        }
        //<--
        else if(key == 37){
            cameraRotationAngle = cameraRotationAngle + (deltaTime * cameraRotationAngleSpeed);
        }
        else if(key == 83 /* s */){
            cameraTranslationY = cameraTranslationY + (deltaTime * cameraTranslationSpeed);
        }
        else if(key == 87 /* w */){
            cameraTranslationY = cameraTranslationY - (deltaTime * cameraTranslationSpeed);
        }

        else if(key == 68 /* d */){
            cameraTranslationZ = cameraTranslationZ + (deltaTime * cameraTranslationSpeed);
        }
        else if(key == 65 /* a */){
            cameraTranslationZ = cameraTranslationZ - (deltaTime * cameraTranslationSpeed);
        }
    }

    //console.log('x = ' + cameraTranslationX + '  y  = ' + cameraTranslationY + '   z = ' + cameraTranslationZ );
    //console.log('camera angle = ' + cameraRotationAngle);


    viewMatrix = mat4.multiply(mat4.create(),viewMatrix,glm.rotateY(cameraRotationAngle));
    viewMatrix = mat4.multiply(mat4.create() , viewMatrix , glm.translate(cameraTranslationX,cameraTranslationY,cameraTranslationZ));

    return viewMatrix;
}


function calculateViewMatrix() {
    //compute the camera's matrix
    var eye = [0,3,5];
    var center = [0,0,0];
    var up = [0,1,0];
    viewMatrix = mat4.lookAt(mat4.create(), eye, center, up);
    return viewMatrix;
}

function calculateViewAnimationMatrix() {
    var eye = [0,3,5];
    var center = [0,0,0];
    var up = [0,1,0];
    viewMatrix = mat4.lookAt(mat4.create(), eye, center, up);
    return viewMatrix;
}

/**
 * base node of the scenegraph
 */
class SceneGraphNode {

    constructor() {
        this.children = [];
    }

    /**
     * appends a new child to this node
     * @param child the child to append
     * @returns {SceneGraphNode} the child
     */
    append(child) {
        this.children.push(child);
        return child;
    }

    /**
     * removes a child from this node
     * @param child
     * @returns {boolean} whether the operation was successful
     */
    remove(child) {
        var i = this.children.indexOf(child);
        if (i >= 0) {
            this.children.splice(i, 1);
        }
        return i >= 0;
    };

    /**
     * render method to render this scengraph
     * @param context
     */
    render(context) {

        //render all children
        this.children.forEach(function (c) {
            return c.render(context);
        });
    };
}

class TransformationSceneGraphNode extends SceneGraphNode {
    /**
     * the matrix to apply
     * @param matrix
     */
    constructor(matrix) {
        super();
        this.matrix = matrix || mat4.create();
    }

    render(context) {
        //backup previous one
        var previous = context.sceneMatrix;
        //set current world matrix by multiplying it
        if (previous === null) {
            context.sceneMatrix = mat4.clone(this.matrix);
        }
        else {
            context.sceneMatrix = mat4.multiply(mat4.create(), previous, this.matrix);
        }

        //render children
        super.render(context);
        //restore backup
        context.sceneMatrix = previous;
    }

    setMatrix(matrix) {
        this.matrix = matrix;
    }
}

//TASK 5-0
/**
 * a shader node sets a specific shader for the successors
 */
class ShaderSceneGraphNode extends SceneGraphNode {
    /**
     * constructs a new shader node with the given shader program
     * @param shader the shader program to use
     */
    constructor(shader) {
        super();
        this.shader = shader;
    }

    render(context) {
        //backup prevoius one
        var backup = context.shader;
        //set current shader
        context.shader = this.shader;
        //activate the shader
        context.gl.useProgram(this.shader);
        //set projection matrix
        gl.uniformMatrix4fv(gl.getUniformLocation(context.shader, 'u_projection'),
            false, context.projectionMatrix);
        //render children
        super.render(context);
        //restore backup
        context.shader = backup;
        //activate the shader
        context.gl.useProgram(backup);
    }
};

function convertDegreeToRadians(degree) {
    return degree * Math.PI / 180
}

class QuadRenderNode extends SceneGraphNode {

    render(context) {
        renderQuad(context);
        super.render(context);
    }
}

class CubeRenderNode extends SceneGraphNode {
    render(contex){
        renderCube(context);
        super.render(context);
    }
}