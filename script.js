// Wait for the page to load
window.onload = function() {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Mengatur warna latar belakang menjadi hitam
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program
    const fsSource = `
        precision mediump float; // Menyatakan precision untuk float
        uniform vec4 uColor; // Warna segitiga
        void main() {
        gl_FragColor = uColor; // Menggunakan warna uniform
        }
    `;

    // Initialize a shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Get the attribute location
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

    // Create a buffer for the triangle's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer operations to from here out
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create an array of positions for the triangle.
    const positions = [
        0.0,  0.5,   // Vertex atas
       -0.5, -0.5,   // Vertex kiri
        0.5, -0.5,   // Vertex kanan
    ];

    // Pass the list of positions into WebGL to build the shape
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Use our shader program
    gl.useProgram(shaderProgram);

    // Draw the triangle with initial color (white)
    let currentColor = [1.0, 1.0, 1.0, 1.0]; // Default to white
    drawTriangle(gl, shaderProgram, currentColor);

    // Event listeners for buttons
    document.getElementById('redButton').onclick = function() {
        currentColor = [1.0, 0.0, 0.0, 1.0]; // Merah
        drawTriangle(gl, shaderProgram, currentColor);
    };

    document.getElementById('yellowButton').onclick = function() {
        currentColor = [1.0, 1.0, 0.0, 1.0]; // Kuning
        drawTriangle(gl, shaderProgram, currentColor);
    };

    document.getElementById('blueButton').onclick = function() {
        currentColor = [0.0, 0.0, 1.0, 1.0]; // Biru
        drawTriangle(gl, shaderProgram, currentColor);
    };

    document.getElementById('resetButton').onclick = function() {
        currentColor = [1.0, 1.0, 1.0, 1.0]; // Reset to white
        drawTriangle(gl, shaderProgram, currentColor);
    };
}



// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Draw the triangle with the specified color
function drawTriangle(gl, shaderProgram, color) {
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

    // Set the color uniform
    const colorLocation = gl.getUniformLocation(shaderProgram, 'uColor');
    gl.useProgram(shaderProgram);
    gl.uniform4fv(colorLocation, color); // Set color

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3); // Menggambar segitiga
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
