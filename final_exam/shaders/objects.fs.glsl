#version 300 es
precision mediump float;

in vec3 updatedSpotlightPos;
in vec3 updatedSpotlightDir;
//out vec3 updatedSpotlightPos;
struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 color;
    float cutoff;
    float outerCutoff;

    vec3 ambient;
    vec3 diffuse;
    vec3 spec;

    float linear;
    float quad;
    float constant;
};

// calculated by vertex shader and passsed to fragment
in vec3 N;
in vec3 L;
in vec3 V;

in vec3 aPos;
in vec3 aNorm;
in vec3 vPos;

// spotlight
uniform SpotLight spotlight;

// Light parameters
uniform vec3 ambientLight;
uniform vec3 lightColor;

// object color parameters
uniform vec3 baseColor;
uniform vec3 specHighlightColor;

// Phong parameters
uniform float ka;
uniform float kd;
uniform float ks;
uniform float ke;

// uvs passed in from vertex shader
in vec2 theUV;

uniform vec3 cameraPos;

// Color that is the result of this shader
out vec4 fragColor;

// 
// shadow handling
// 

uniform float bias;

uniform vec2 shadowClipNearFar;
uniform samplerCube lightShadowMap;
// the texture to use
uniform sampler2D theTexture;

in vec3 fPos;
in vec3 fNorm;

void main(void) {

    // 
    // handle shadow
    // 
    vec3 toLightNormal = normalize(updatedSpotlightPos - fPos);

    float fromLightToFrag = (length(fPos - updatedSpotlightPos) - shadowClipNearFar.x) /
        (shadowClipNearFar.y - shadowClipNearFar.x);

    float shadowMapValue = texture(lightShadowMap, -toLightNormal).r;

    float lightIntensity = 0.6;
    if((shadowMapValue + 0.003) >= fromLightToFrag) {
        lightIntensity += 0.4 * max(dot(fNorm, toLightNormal), 0.0);
    }

    // 
    // normal stuff
    // 

    // individual components
    vec3 R = normalize(reflect(-L, N));

    vec3 H = normalize(updatedSpotlightPos - aPos);
    float cTheeta = dot(normalize(updatedSpotlightDir - updatedSpotlightPos), -H);
    float epsilon = spotlight.cutoff - spotlight.outerCutoff;
    float intensity = clamp((cTheeta - spotlight.outerCutoff) / epsilon, 0.0, 1.0);

    vec3 ambient = ka * ambientLight * baseColor;
    vec3 diffuse = kd * lightColor * baseColor * max(dot(L, N), 0.0);
    vec3 spec = ks * specHighlightColor * lightColor * pow(max(dot(R, V), 0.0), ke);

    float dist = length(vPos - spotlight.position);
    float attenuation = 1.0 / (spotlight.constant + spotlight.linear * dist + spotlight.quad * (dist * dist));

    // if (cTheeta > spotlight.cutoff) {
    ambient += 0.235 * spotlight.ambient;
    diffuse += 0.35 * spotlight.diffuse;
    spec += 0.135 * spotlight.spec;
    // }

    diffuse *= intensity;
    spec *= intensity;

    ambient *= attenuation;
    diffuse *= attenuation;
    spec *= attenuation;

    // fragColor = vec4 (0.5, 0.5, 0.5, 1.0 );
    fragColor = vec4((ambient + diffuse + spec) * vec3(texture(theTexture, theUV)), 1.0);
    // fragColor = texture (theTexture, theUV);

    // fragColor = vec4(fragColor.rgb * lightIntensity, fragColor.a);
    // fragColor = vec4(lightIntensity,lightIntensity,lightIntensity,1.0);

}
