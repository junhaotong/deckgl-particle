var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import { LineLayer } from "@deck.gl/layers";
import { Buffer as Buffer2, Transform, Texture2D } from "@luma.gl/core";
var GL = {
  DEPTH_BUFFER_BIT: 256,
  STENCIL_BUFFER_BIT: 1024,
  COLOR_BUFFER_BIT: 16384,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  ZERO: 0,
  ONE: 1,
  SRC_COLOR: 768,
  ONE_MINUS_SRC_COLOR: 769,
  SRC_ALPHA: 770,
  ONE_MINUS_SRC_ALPHA: 771,
  DST_ALPHA: 772,
  ONE_MINUS_DST_ALPHA: 773,
  DST_COLOR: 774,
  ONE_MINUS_DST_COLOR: 775,
  SRC_ALPHA_SATURATE: 776,
  CONSTANT_COLOR: 32769,
  ONE_MINUS_CONSTANT_COLOR: 32770,
  CONSTANT_ALPHA: 32771,
  ONE_MINUS_CONSTANT_ALPHA: 32772,
  FUNC_ADD: 32774,
  FUNC_SUBTRACT: 32778,
  FUNC_REVERSE_SUBTRACT: 32779,
  BLEND_EQUATION: 32777,
  BLEND_EQUATION_RGB: 32777,
  BLEND_EQUATION_ALPHA: 34877,
  BLEND_DST_RGB: 32968,
  BLEND_SRC_RGB: 32969,
  BLEND_DST_ALPHA: 32970,
  BLEND_SRC_ALPHA: 32971,
  BLEND_COLOR: 32773,
  ARRAY_BUFFER_BINDING: 34964,
  ELEMENT_ARRAY_BUFFER_BINDING: 34965,
  LINE_WIDTH: 2849,
  ALIASED_POINT_SIZE_RANGE: 33901,
  ALIASED_LINE_WIDTH_RANGE: 33902,
  CULL_FACE_MODE: 2885,
  FRONT_FACE: 2886,
  DEPTH_RANGE: 2928,
  DEPTH_WRITEMASK: 2930,
  DEPTH_CLEAR_VALUE: 2931,
  DEPTH_FUNC: 2932,
  STENCIL_CLEAR_VALUE: 2961,
  STENCIL_FUNC: 2962,
  STENCIL_FAIL: 2964,
  STENCIL_PASS_DEPTH_FAIL: 2965,
  STENCIL_PASS_DEPTH_PASS: 2966,
  STENCIL_REF: 2967,
  STENCIL_VALUE_MASK: 2963,
  STENCIL_WRITEMASK: 2968,
  STENCIL_BACK_FUNC: 34816,
  STENCIL_BACK_FAIL: 34817,
  STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
  STENCIL_BACK_PASS_DEPTH_PASS: 34819,
  STENCIL_BACK_REF: 36003,
  STENCIL_BACK_VALUE_MASK: 36004,
  STENCIL_BACK_WRITEMASK: 36005,
  VIEWPORT: 2978,
  SCISSOR_BOX: 3088,
  COLOR_CLEAR_VALUE: 3106,
  COLOR_WRITEMASK: 3107,
  UNPACK_ALIGNMENT: 3317,
  PACK_ALIGNMENT: 3333,
  MAX_TEXTURE_SIZE: 3379,
  MAX_VIEWPORT_DIMS: 3386,
  SUBPIXEL_BITS: 3408,
  RED_BITS: 3410,
  GREEN_BITS: 3411,
  BLUE_BITS: 3412,
  ALPHA_BITS: 3413,
  DEPTH_BITS: 3414,
  STENCIL_BITS: 3415,
  POLYGON_OFFSET_UNITS: 10752,
  POLYGON_OFFSET_FACTOR: 32824,
  TEXTURE_BINDING_2D: 32873,
  SAMPLE_BUFFERS: 32936,
  SAMPLES: 32937,
  SAMPLE_COVERAGE_VALUE: 32938,
  SAMPLE_COVERAGE_INVERT: 32939,
  COMPRESSED_TEXTURE_FORMATS: 34467,
  VENDOR: 7936,
  RENDERER: 7937,
  VERSION: 7938,
  IMPLEMENTATION_COLOR_READ_TYPE: 35738,
  IMPLEMENTATION_COLOR_READ_FORMAT: 35739,
  BROWSER_DEFAULT_WEBGL: 37444,
  STATIC_DRAW: 35044,
  STREAM_DRAW: 35040,
  DYNAMIC_DRAW: 35048,
  ARRAY_BUFFER: 34962,
  ELEMENT_ARRAY_BUFFER: 34963,
  BUFFER_SIZE: 34660,
  BUFFER_USAGE: 34661,
  CURRENT_VERTEX_ATTRIB: 34342,
  VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
  VERTEX_ATTRIB_ARRAY_SIZE: 34339,
  VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
  VERTEX_ATTRIB_ARRAY_TYPE: 34341,
  VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
  VERTEX_ATTRIB_ARRAY_POINTER: 34373,
  VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
  CULL_FACE: 2884,
  FRONT: 1028,
  BACK: 1029,
  FRONT_AND_BACK: 1032,
  BLEND: 3042,
  DEPTH_TEST: 2929,
  DITHER: 3024,
  POLYGON_OFFSET_FILL: 32823,
  SAMPLE_ALPHA_TO_COVERAGE: 32926,
  SAMPLE_COVERAGE: 32928,
  SCISSOR_TEST: 3089,
  STENCIL_TEST: 2960,
  NO_ERROR: 0,
  INVALID_ENUM: 1280,
  INVALID_VALUE: 1281,
  INVALID_OPERATION: 1282,
  OUT_OF_MEMORY: 1285,
  CONTEXT_LOST_WEBGL: 37442,
  CW: 2304,
  CCW: 2305,
  DONT_CARE: 4352,
  FASTEST: 4353,
  NICEST: 4354,
  GENERATE_MIPMAP_HINT: 33170,
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  INT: 5124,
  UNSIGNED_INT: 5125,
  FLOAT: 5126,
  DOUBLE: 5130,
  DEPTH_COMPONENT: 6402,
  ALPHA: 6406,
  RGB: 6407,
  RGBA: 6408,
  LUMINANCE: 6409,
  LUMINANCE_ALPHA: 6410,
  UNSIGNED_SHORT_4_4_4_4: 32819,
  UNSIGNED_SHORT_5_5_5_1: 32820,
  UNSIGNED_SHORT_5_6_5: 33635,
  FRAGMENT_SHADER: 35632,
  VERTEX_SHADER: 35633,
  COMPILE_STATUS: 35713,
  DELETE_STATUS: 35712,
  LINK_STATUS: 35714,
  VALIDATE_STATUS: 35715,
  ATTACHED_SHADERS: 35717,
  ACTIVE_ATTRIBUTES: 35721,
  ACTIVE_UNIFORMS: 35718,
  MAX_VERTEX_ATTRIBS: 34921,
  MAX_VERTEX_UNIFORM_VECTORS: 36347,
  MAX_VARYING_VECTORS: 36348,
  MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
  MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
  MAX_TEXTURE_IMAGE_UNITS: 34930,
  MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
  SHADER_TYPE: 35663,
  SHADING_LANGUAGE_VERSION: 35724,
  CURRENT_PROGRAM: 35725,
  NEVER: 512,
  ALWAYS: 519,
  LESS: 513,
  EQUAL: 514,
  LEQUAL: 515,
  GREATER: 516,
  GEQUAL: 518,
  NOTEQUAL: 517,
  KEEP: 7680,
  REPLACE: 7681,
  INCR: 7682,
  DECR: 7683,
  INVERT: 5386,
  INCR_WRAP: 34055,
  DECR_WRAP: 34056,
  NEAREST: 9728,
  LINEAR: 9729,
  NEAREST_MIPMAP_NEAREST: 9984,
  LINEAR_MIPMAP_NEAREST: 9985,
  NEAREST_MIPMAP_LINEAR: 9986,
  LINEAR_MIPMAP_LINEAR: 9987,
  TEXTURE_MAG_FILTER: 10240,
  TEXTURE_MIN_FILTER: 10241,
  TEXTURE_WRAP_S: 10242,
  TEXTURE_WRAP_T: 10243,
  TEXTURE_2D: 3553,
  TEXTURE: 5890,
  TEXTURE_CUBE_MAP: 34067,
  TEXTURE_BINDING_CUBE_MAP: 34068,
  TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
  TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
  TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
  TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
  TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
  TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
  MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
  TEXTURE0: 33984,
  ACTIVE_TEXTURE: 34016,
  REPEAT: 10497,
  CLAMP_TO_EDGE: 33071,
  MIRRORED_REPEAT: 33648,
  TEXTURE_WIDTH: 4096,
  TEXTURE_HEIGHT: 4097,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  INT_VEC2: 35667,
  INT_VEC3: 35668,
  INT_VEC4: 35669,
  BOOL: 35670,
  BOOL_VEC2: 35671,
  BOOL_VEC3: 35672,
  BOOL_VEC4: 35673,
  FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  SAMPLER_2D: 35678,
  SAMPLER_CUBE: 35680,
  LOW_FLOAT: 36336,
  MEDIUM_FLOAT: 36337,
  HIGH_FLOAT: 36338,
  LOW_INT: 36339,
  MEDIUM_INT: 36340,
  HIGH_INT: 36341,
  FRAMEBUFFER: 36160,
  RENDERBUFFER: 36161,
  RGBA4: 32854,
  RGB5_A1: 32855,
  RGB565: 36194,
  DEPTH_COMPONENT16: 33189,
  STENCIL_INDEX: 6401,
  STENCIL_INDEX8: 36168,
  DEPTH_STENCIL: 34041,
  RENDERBUFFER_WIDTH: 36162,
  RENDERBUFFER_HEIGHT: 36163,
  RENDERBUFFER_INTERNAL_FORMAT: 36164,
  RENDERBUFFER_RED_SIZE: 36176,
  RENDERBUFFER_GREEN_SIZE: 36177,
  RENDERBUFFER_BLUE_SIZE: 36178,
  RENDERBUFFER_ALPHA_SIZE: 36179,
  RENDERBUFFER_DEPTH_SIZE: 36180,
  RENDERBUFFER_STENCIL_SIZE: 36181,
  FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
  FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
  COLOR_ATTACHMENT0: 36064,
  DEPTH_ATTACHMENT: 36096,
  STENCIL_ATTACHMENT: 36128,
  DEPTH_STENCIL_ATTACHMENT: 33306,
  NONE: 0,
  FRAMEBUFFER_COMPLETE: 36053,
  FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
  FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
  FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
  FRAMEBUFFER_UNSUPPORTED: 36061,
  FRAMEBUFFER_BINDING: 36006,
  RENDERBUFFER_BINDING: 36007,
  READ_FRAMEBUFFER: 36008,
  DRAW_FRAMEBUFFER: 36009,
  MAX_RENDERBUFFER_SIZE: 34024,
  INVALID_FRAMEBUFFER_OPERATION: 1286,
  UNPACK_FLIP_Y_WEBGL: 37440,
  UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
  UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
  READ_BUFFER: 3074,
  UNPACK_ROW_LENGTH: 3314,
  UNPACK_SKIP_ROWS: 3315,
  UNPACK_SKIP_PIXELS: 3316,
  PACK_ROW_LENGTH: 3330,
  PACK_SKIP_ROWS: 3331,
  PACK_SKIP_PIXELS: 3332,
  TEXTURE_BINDING_3D: 32874,
  UNPACK_SKIP_IMAGES: 32877,
  UNPACK_IMAGE_HEIGHT: 32878,
  MAX_3D_TEXTURE_SIZE: 32883,
  MAX_ELEMENTS_VERTICES: 33e3,
  MAX_ELEMENTS_INDICES: 33001,
  MAX_TEXTURE_LOD_BIAS: 34045,
  MAX_FRAGMENT_UNIFORM_COMPONENTS: 35657,
  MAX_VERTEX_UNIFORM_COMPONENTS: 35658,
  MAX_ARRAY_TEXTURE_LAYERS: 35071,
  MIN_PROGRAM_TEXEL_OFFSET: 35076,
  MAX_PROGRAM_TEXEL_OFFSET: 35077,
  MAX_VARYING_COMPONENTS: 35659,
  FRAGMENT_SHADER_DERIVATIVE_HINT: 35723,
  RASTERIZER_DISCARD: 35977,
  VERTEX_ARRAY_BINDING: 34229,
  MAX_VERTEX_OUTPUT_COMPONENTS: 37154,
  MAX_FRAGMENT_INPUT_COMPONENTS: 37157,
  MAX_SERVER_WAIT_TIMEOUT: 37137,
  MAX_ELEMENT_INDEX: 36203,
  RED: 6403,
  RGB8: 32849,
  RGBA8: 32856,
  RGB10_A2: 32857,
  TEXTURE_3D: 32879,
  TEXTURE_WRAP_R: 32882,
  TEXTURE_MIN_LOD: 33082,
  TEXTURE_MAX_LOD: 33083,
  TEXTURE_BASE_LEVEL: 33084,
  TEXTURE_MAX_LEVEL: 33085,
  TEXTURE_COMPARE_MODE: 34892,
  TEXTURE_COMPARE_FUNC: 34893,
  SRGB: 35904,
  SRGB8: 35905,
  SRGB8_ALPHA8: 35907,
  COMPARE_REF_TO_TEXTURE: 34894,
  RGBA32F: 34836,
  RGB32F: 34837,
  RGBA16F: 34842,
  RGB16F: 34843,
  TEXTURE_2D_ARRAY: 35866,
  TEXTURE_BINDING_2D_ARRAY: 35869,
  R11F_G11F_B10F: 35898,
  RGB9_E5: 35901,
  RGBA32UI: 36208,
  RGB32UI: 36209,
  RGBA16UI: 36214,
  RGB16UI: 36215,
  RGBA8UI: 36220,
  RGB8UI: 36221,
  RGBA32I: 36226,
  RGB32I: 36227,
  RGBA16I: 36232,
  RGB16I: 36233,
  RGBA8I: 36238,
  RGB8I: 36239,
  RED_INTEGER: 36244,
  RGB_INTEGER: 36248,
  RGBA_INTEGER: 36249,
  R8: 33321,
  RG8: 33323,
  R16F: 33325,
  R32F: 33326,
  RG16F: 33327,
  RG32F: 33328,
  R8I: 33329,
  R8UI: 33330,
  R16I: 33331,
  R16UI: 33332,
  R32I: 33333,
  R32UI: 33334,
  RG8I: 33335,
  RG8UI: 33336,
  RG16I: 33337,
  RG16UI: 33338,
  RG32I: 33339,
  RG32UI: 33340,
  R8_SNORM: 36756,
  RG8_SNORM: 36757,
  RGB8_SNORM: 36758,
  RGBA8_SNORM: 36759,
  RGB10_A2UI: 36975,
  TEXTURE_IMMUTABLE_FORMAT: 37167,
  TEXTURE_IMMUTABLE_LEVELS: 33503,
  UNSIGNED_INT_2_10_10_10_REV: 33640,
  UNSIGNED_INT_10F_11F_11F_REV: 35899,
  UNSIGNED_INT_5_9_9_9_REV: 35902,
  FLOAT_32_UNSIGNED_INT_24_8_REV: 36269,
  UNSIGNED_INT_24_8: 34042,
  HALF_FLOAT: 5131,
  RG: 33319,
  RG_INTEGER: 33320,
  INT_2_10_10_10_REV: 36255,
  CURRENT_QUERY: 34917,
  QUERY_RESULT: 34918,
  QUERY_RESULT_AVAILABLE: 34919,
  ANY_SAMPLES_PASSED: 35887,
  ANY_SAMPLES_PASSED_CONSERVATIVE: 36202,
  MAX_DRAW_BUFFERS: 34852,
  DRAW_BUFFER0: 34853,
  DRAW_BUFFER1: 34854,
  DRAW_BUFFER2: 34855,
  DRAW_BUFFER3: 34856,
  DRAW_BUFFER4: 34857,
  DRAW_BUFFER5: 34858,
  DRAW_BUFFER6: 34859,
  DRAW_BUFFER7: 34860,
  DRAW_BUFFER8: 34861,
  DRAW_BUFFER9: 34862,
  DRAW_BUFFER10: 34863,
  DRAW_BUFFER11: 34864,
  DRAW_BUFFER12: 34865,
  DRAW_BUFFER13: 34866,
  DRAW_BUFFER14: 34867,
  DRAW_BUFFER15: 34868,
  MAX_COLOR_ATTACHMENTS: 36063,
  COLOR_ATTACHMENT1: 36065,
  COLOR_ATTACHMENT2: 36066,
  COLOR_ATTACHMENT3: 36067,
  COLOR_ATTACHMENT4: 36068,
  COLOR_ATTACHMENT5: 36069,
  COLOR_ATTACHMENT6: 36070,
  COLOR_ATTACHMENT7: 36071,
  COLOR_ATTACHMENT8: 36072,
  COLOR_ATTACHMENT9: 36073,
  COLOR_ATTACHMENT10: 36074,
  COLOR_ATTACHMENT11: 36075,
  COLOR_ATTACHMENT12: 36076,
  COLOR_ATTACHMENT13: 36077,
  COLOR_ATTACHMENT14: 36078,
  COLOR_ATTACHMENT15: 36079,
  SAMPLER_3D: 35679,
  SAMPLER_2D_SHADOW: 35682,
  SAMPLER_2D_ARRAY: 36289,
  SAMPLER_2D_ARRAY_SHADOW: 36292,
  SAMPLER_CUBE_SHADOW: 36293,
  INT_SAMPLER_2D: 36298,
  INT_SAMPLER_3D: 36299,
  INT_SAMPLER_CUBE: 36300,
  INT_SAMPLER_2D_ARRAY: 36303,
  UNSIGNED_INT_SAMPLER_2D: 36306,
  UNSIGNED_INT_SAMPLER_3D: 36307,
  UNSIGNED_INT_SAMPLER_CUBE: 36308,
  UNSIGNED_INT_SAMPLER_2D_ARRAY: 36311,
  MAX_SAMPLES: 36183,
  SAMPLER_BINDING: 35097,
  PIXEL_PACK_BUFFER: 35051,
  PIXEL_UNPACK_BUFFER: 35052,
  PIXEL_PACK_BUFFER_BINDING: 35053,
  PIXEL_UNPACK_BUFFER_BINDING: 35055,
  COPY_READ_BUFFER: 36662,
  COPY_WRITE_BUFFER: 36663,
  COPY_READ_BUFFER_BINDING: 36662,
  COPY_WRITE_BUFFER_BINDING: 36663,
  FLOAT_MAT2x3: 35685,
  FLOAT_MAT2x4: 35686,
  FLOAT_MAT3x2: 35687,
  FLOAT_MAT3x4: 35688,
  FLOAT_MAT4x2: 35689,
  FLOAT_MAT4x3: 35690,
  UNSIGNED_INT_VEC2: 36294,
  UNSIGNED_INT_VEC3: 36295,
  UNSIGNED_INT_VEC4: 36296,
  UNSIGNED_NORMALIZED: 35863,
  SIGNED_NORMALIZED: 36764,
  VERTEX_ATTRIB_ARRAY_INTEGER: 35069,
  VERTEX_ATTRIB_ARRAY_DIVISOR: 35070,
  TRANSFORM_FEEDBACK_BUFFER_MODE: 35967,
  MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 35968,
  TRANSFORM_FEEDBACK_VARYINGS: 35971,
  TRANSFORM_FEEDBACK_BUFFER_START: 35972,
  TRANSFORM_FEEDBACK_BUFFER_SIZE: 35973,
  TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 35976,
  MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 35978,
  MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 35979,
  INTERLEAVED_ATTRIBS: 35980,
  SEPARATE_ATTRIBS: 35981,
  TRANSFORM_FEEDBACK_BUFFER: 35982,
  TRANSFORM_FEEDBACK_BUFFER_BINDING: 35983,
  TRANSFORM_FEEDBACK: 36386,
  TRANSFORM_FEEDBACK_PAUSED: 36387,
  TRANSFORM_FEEDBACK_ACTIVE: 36388,
  TRANSFORM_FEEDBACK_BINDING: 36389,
  FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 33296,
  FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 33297,
  FRAMEBUFFER_ATTACHMENT_RED_SIZE: 33298,
  FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 33299,
  FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 33300,
  FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 33301,
  FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 33302,
  FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 33303,
  FRAMEBUFFER_DEFAULT: 33304,
  DEPTH24_STENCIL8: 35056,
  DRAW_FRAMEBUFFER_BINDING: 36006,
  READ_FRAMEBUFFER_BINDING: 36010,
  RENDERBUFFER_SAMPLES: 36011,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 36052,
  FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 36182,
  UNIFORM_BUFFER: 35345,
  UNIFORM_BUFFER_BINDING: 35368,
  UNIFORM_BUFFER_START: 35369,
  UNIFORM_BUFFER_SIZE: 35370,
  MAX_VERTEX_UNIFORM_BLOCKS: 35371,
  MAX_FRAGMENT_UNIFORM_BLOCKS: 35373,
  MAX_COMBINED_UNIFORM_BLOCKS: 35374,
  MAX_UNIFORM_BUFFER_BINDINGS: 35375,
  MAX_UNIFORM_BLOCK_SIZE: 35376,
  MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 35377,
  MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 35379,
  UNIFORM_BUFFER_OFFSET_ALIGNMENT: 35380,
  ACTIVE_UNIFORM_BLOCKS: 35382,
  UNIFORM_TYPE: 35383,
  UNIFORM_SIZE: 35384,
  UNIFORM_BLOCK_INDEX: 35386,
  UNIFORM_OFFSET: 35387,
  UNIFORM_ARRAY_STRIDE: 35388,
  UNIFORM_MATRIX_STRIDE: 35389,
  UNIFORM_IS_ROW_MAJOR: 35390,
  UNIFORM_BLOCK_BINDING: 35391,
  UNIFORM_BLOCK_DATA_SIZE: 35392,
  UNIFORM_BLOCK_ACTIVE_UNIFORMS: 35394,
  UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 35395,
  UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 35396,
  UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 35398,
  OBJECT_TYPE: 37138,
  SYNC_CONDITION: 37139,
  SYNC_STATUS: 37140,
  SYNC_FLAGS: 37141,
  SYNC_FENCE: 37142,
  SYNC_GPU_COMMANDS_COMPLETE: 37143,
  UNSIGNALED: 37144,
  SIGNALED: 37145,
  ALREADY_SIGNALED: 37146,
  TIMEOUT_EXPIRED: 37147,
  CONDITION_SATISFIED: 37148,
  WAIT_FAILED: 37149,
  SYNC_FLUSH_COMMANDS_BIT: 1,
  COLOR: 6144,
  DEPTH: 6145,
  STENCIL: 6146,
  MIN: 32775,
  MAX: 32776,
  DEPTH_COMPONENT24: 33190,
  STREAM_READ: 35041,
  STREAM_COPY: 35042,
  STATIC_READ: 35045,
  STATIC_COPY: 35046,
  DYNAMIC_READ: 35049,
  DYNAMIC_COPY: 35050,
  DEPTH_COMPONENT32F: 36012,
  DEPTH32F_STENCIL8: 36013,
  INVALID_INDEX: 4294967295,
  TIMEOUT_IGNORED: -1,
  MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 37447,
  VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 35070,
  UNMASKED_VENDOR_WEBGL: 37445,
  UNMASKED_RENDERER_WEBGL: 37446,
  MAX_TEXTURE_MAX_ANISOTROPY_EXT: 34047,
  TEXTURE_MAX_ANISOTROPY_EXT: 34046,
  COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
  COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
  COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
  COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
  COMPRESSED_R11_EAC: 37488,
  COMPRESSED_SIGNED_R11_EAC: 37489,
  COMPRESSED_RG11_EAC: 37490,
  COMPRESSED_SIGNED_RG11_EAC: 37491,
  COMPRESSED_RGB8_ETC2: 37492,
  COMPRESSED_RGBA8_ETC2_EAC: 37493,
  COMPRESSED_SRGB8_ETC2: 37494,
  COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37495,
  COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37496,
  COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37497,
  COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
  COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
  COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
  COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
  COMPRESSED_RGB_ETC1_WEBGL: 36196,
  COMPRESSED_RGB_ATC_WEBGL: 35986,
  COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 35986,
  COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 34798,
  UNSIGNED_INT_24_8_WEBGL: 34042,
  HALF_FLOAT_OES: 36193,
  RGBA32F_EXT: 34836,
  RGB32F_EXT: 34837,
  FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 33297,
  UNSIGNED_NORMALIZED_EXT: 35863,
  MIN_EXT: 32775,
  MAX_EXT: 32776,
  SRGB_EXT: 35904,
  SRGB_ALPHA_EXT: 35906,
  SRGB8_ALPHA8_EXT: 35907,
  FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 33296,
  FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 35723,
  COLOR_ATTACHMENT0_WEBGL: 36064,
  COLOR_ATTACHMENT1_WEBGL: 36065,
  COLOR_ATTACHMENT2_WEBGL: 36066,
  COLOR_ATTACHMENT3_WEBGL: 36067,
  COLOR_ATTACHMENT4_WEBGL: 36068,
  COLOR_ATTACHMENT5_WEBGL: 36069,
  COLOR_ATTACHMENT6_WEBGL: 36070,
  COLOR_ATTACHMENT7_WEBGL: 36071,
  COLOR_ATTACHMENT8_WEBGL: 36072,
  COLOR_ATTACHMENT9_WEBGL: 36073,
  COLOR_ATTACHMENT10_WEBGL: 36074,
  COLOR_ATTACHMENT11_WEBGL: 36075,
  COLOR_ATTACHMENT12_WEBGL: 36076,
  COLOR_ATTACHMENT13_WEBGL: 36077,
  COLOR_ATTACHMENT14_WEBGL: 36078,
  COLOR_ATTACHMENT15_WEBGL: 36079,
  DRAW_BUFFER0_WEBGL: 34853,
  DRAW_BUFFER1_WEBGL: 34854,
  DRAW_BUFFER2_WEBGL: 34855,
  DRAW_BUFFER3_WEBGL: 34856,
  DRAW_BUFFER4_WEBGL: 34857,
  DRAW_BUFFER5_WEBGL: 34858,
  DRAW_BUFFER6_WEBGL: 34859,
  DRAW_BUFFER7_WEBGL: 34860,
  DRAW_BUFFER8_WEBGL: 34861,
  DRAW_BUFFER9_WEBGL: 34862,
  DRAW_BUFFER10_WEBGL: 34863,
  DRAW_BUFFER11_WEBGL: 34864,
  DRAW_BUFFER12_WEBGL: 34865,
  DRAW_BUFFER13_WEBGL: 34866,
  DRAW_BUFFER14_WEBGL: 34867,
  DRAW_BUFFER15_WEBGL: 34868,
  MAX_COLOR_ATTACHMENTS_WEBGL: 36063,
  MAX_DRAW_BUFFERS_WEBGL: 34852,
  VERTEX_ARRAY_BINDING_OES: 34229,
  QUERY_COUNTER_BITS_EXT: 34916,
  CURRENT_QUERY_EXT: 34917,
  QUERY_RESULT_EXT: 34918,
  QUERY_RESULT_AVAILABLE_EXT: 34919,
  TIME_ELAPSED_EXT: 35007,
  TIMESTAMP_EXT: 36392,
  GPU_DISJOINT_EXT: 36795
};
var updateTransformVs = `#version 300 es
#define SHADER_NAME particle-layer-update-transform-vertex-shader

precision highp float;

in vec3 sourcePosition;
out vec3 targetPosition;

uniform sampler2D speedTexture;
uniform vec4 bounds;

uniform float numParticles;
uniform float maxAge;

uniform float viewportSphere;
uniform vec2 viewportSphereCenter;
uniform float viewportSphereRadius;
uniform vec4 viewportBounds;
uniform float viewportSpeedFactor;

uniform float time;
uniform float seed;

const vec2 DROP_POSITION = vec2(0);

vec2 getUV(vec2 pos) {
  return vec2(
    (pos.x - bounds[0]) / (bounds[2] - bounds[0]),
    (pos.y - bounds[3]) / (bounds[1] - bounds[3])
  );
}

vec4 clipBox(vec4 bbox1, vec4 bbox2) {
    return vec4(
        max(bbox1[0], bbox2[0]),
        max(bbox1[1], bbox2[1]),
        min(bbox1[2], bbox2[2]),
        min(bbox1[3], bbox2[3])
    );
}

// see https://stackoverflow.com/a/27228836/1823988
float atan2(float y, float x) {
  return x == 0. ? sign(y) * PI / 2. : atan(y, x);
}

// see https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js#L187
float distanceTo(vec2 from, vec2 point) {
  float y1 = radians(from.y);
  float x1 = radians(from.x);
  float y2 = radians(point.y);
  float x2 = radians(point.x);
  float dy = y2 - y1;
  float dx = x2 - x1;

  float a = sin(dy / 2.) * sin(dy / 2.) + cos(y1) * cos(y2) * sin(dx / 2.) * sin(dx / 2.);
  float c = 2. * atan2(sqrt(a), sqrt(1. - a));
  float d = EARTH_RADIUS * c;

  return d;
}

// see https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js#L360
vec2 destinationPoint(vec2 from, float dist, float bearing) {
  float d = dist / EARTH_RADIUS;
  float r = radians(bearing);

  float y1 = radians(from.y);
  float x1 = radians(from.x);

  float siny2 = sin(y1) * cos(d) + cos(y1) * sin(d) * cos(r);
  float y2 = asin(siny2);
  float y = sin(r) * sin(d) * cos(y1);
  float x = cos(d) - sin(y1) * siny2;
  float x2 = x1 + atan2(y, x);

  float lat = degrees(y2);
  float lon = degrees(x2);

  return vec2(lon, lat);
}

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 randVec2(vec2 seed) {
  return vec2(rand(seed + 1.3), rand(seed + 2.1));
}

vec2 randPosition(vec2 seed) {
  vec2 randomVec2 = randVec2(seed);
  
  if (viewportSphere > 0.5) {
    randomVec2.x += 0.0001; // prevent generating point in the center
    float dist = sqrt(randomVec2.x) * viewportSphereRadius;
    float bearing = randomVec2.y * 360.;
    return destinationPoint(viewportSphereCenter, dist, bearing);
  } else {
    vec2 viewportBoundsMin = viewportBounds.xy;
    vec2 viewportBoundsMax = viewportBounds.zw;
    return mix(viewportBoundsMin, viewportBoundsMax, randomVec2);
  }
}

bool isPositionVisible(vec2 position) {
  if (viewportSphere > 0.5) {
    return distanceTo(viewportSphereCenter, position) <= viewportSphereRadius;
  } else {
    vec2 viewportBoundsMin = viewportBounds.xy;
    vec2 viewportBoundsMax = viewportBounds.zw;
    return (
      viewportBoundsMin.x <= position.x && position.x <= viewportBoundsMax.x &&
      viewportBoundsMin.y <= position.y && position.y <= viewportBoundsMax.y
    );
  }
}

void main() {
  float particleIndex = mod(float(gl_VertexID), numParticles);
  float particleAge = floor(float(gl_VertexID) / numParticles);

  if (sourcePosition.xy != DROP_POSITION) {
    // update position
    vec2 uv = getUV(sourcePosition.xy);
    vec4 values = texture2D(speedTexture, uv);
    vec2 speed = values.xy * 2. - 1.;
    // float dist = sqrt(speed.x * speed.x + speed.y + speed.y) * viewportSpeedFactor * 10000.;
    // float bearing = degrees(-atan2(speed.y, speed.x));
    // targetPosition.xy = destinationPoint(sourcePosition.xy, dist, bearing);
    float distortion = cos(radians(sourcePosition.y)); 
    vec2 distortedSpeed = vec2(speed.x / distortion, speed.y);
    vec2 offset = distortedSpeed * viewportSpeedFactor;
    targetPosition.xy = sourcePosition.xy + offset;

    if (values.a != 1.) {
      // drop nodata
      targetPosition.xy = DROP_POSITION;
    }

    // drop out of bounds
    if (!isPositionVisible(sourcePosition.xy) || !isPositionVisible(targetPosition.xy)) {
      targetPosition.xy = DROP_POSITION;
    }

    if (particleAge < 1.) {
      if (abs(mod(particleIndex, maxAge + 2.) - mod(time, maxAge + 2.)) < 1.) {
        // drop by maxAge, +2 because only non-randomized pairs are rendered
        targetPosition.xy = DROP_POSITION;
      }
    }
  } else {
    if (particleAge < 1.) {
      // generate random position to prevent converging particles
      vec2 randomSeed = vec2(particleIndex * seed / numParticles);
      vec2 randomPosition = randPosition(randomSeed);
      targetPosition.xy = randomPosition;
    } else {
      targetPosition.xy = DROP_POSITION;
    }
  }
}
`;
var earthRadius = 63710088e-1;
var factors = {
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  degrees: earthRadius / 111325,
  feet: earthRadius * 3.28084,
  inches: earthRadius * 39.37,
  kilometers: earthRadius / 1e3,
  kilometres: earthRadius / 1e3,
  meters: earthRadius,
  metres: earthRadius,
  miles: earthRadius / 1609.344,
  millimeters: earthRadius * 1e3,
  millimetres: earthRadius * 1e3,
  nauticalmiles: earthRadius / 1852,
  radians: 1,
  yards: earthRadius * 1.0936
};
function radiansToLength(radians, units) {
  if (units === void 0) {
    units = "kilometers";
  }
  var factor = factors[units];
  if (!factor) {
    throw new Error(units + " units is invalid");
  }
  return radians * factor;
}
function degreesToRadians(degrees) {
  var radians = degrees % 360;
  return radians * Math.PI / 180;
}
function getCoord(coord) {
  if (!coord) {
    throw new Error("coord is required");
  }
  if (!Array.isArray(coord)) {
    if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
      return coord.geometry.coordinates;
    }
    if (coord.type === "Point") {
      return coord.coordinates;
    }
  }
  if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
    return coord;
  }
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function distance(from, to, options) {
  if (options === void 0) {
    options = {};
  }
  var coordinates1 = getCoord(from);
  var coordinates2 = getCoord(to);
  var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
  var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
  var lat1 = degreesToRadians(coordinates1[1]);
  var lat2 = degreesToRadians(coordinates2[1]);
  var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  return radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units);
}
const DEFAULT_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_WRAP_S]: GL.REPEAT
};
const DEFAULT_COLORS = {
  0: "#3288bd",
  0.1: "#66c2a5",
  0.2: "#abdda4",
  0.3: "#e6f598",
  0.4: "#fee08b",
  0.5: "#fdae61",
  0.6: "#f46d43",
  1: "#d53e4f"
};
const clipBox = (bbox1, bbox2) => {
  return [
    Math.max(bbox1[0], bbox2[0]),
    Math.max(bbox1[1], bbox2[1]),
    Math.min(bbox1[2], bbox2[2]),
    Math.min(bbox1[3], bbox2[3])
  ];
};
const defaultProps = __spreadProps(__spreadValues({}, LineLayer.defaultProps), {
  image: { type: "image", value: null, async: true },
  bounds: { type: "array", value: [-180, -90, 180, 90], compare: true },
  _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
  textureParameters: DEFAULT_TEXTURE_PARAMETERS,
  numParticles: { type: "number", min: 1, max: 1e6, value: 5e3 },
  maxAge: { type: "number", min: 1, max: 255, value: 100 },
  speedFactor: { type: "number", min: 0, max: 1, value: 1 },
  colors: { type: "object", value: DEFAULT_COLORS },
  width: { type: "number", value: 1 },
  uWindMin: { type: "number", value: 0 },
  uWindMax: { type: "number", value: 0 },
  vWindMin: { type: "number", value: 0 },
  vWindMax: { type: "number", value: 0 },
  animate: true,
  boundsClip: { type: "boolean", value: false }
});
class ParticleLayer extends LineLayer {
  getShaders() {
    return __spreadProps(__spreadValues({}, super.getShaders()), {
      inject: {
        "vs:#decl": `
          varying float drop;
          varying vec2 positionWind;
          const vec2 DROP_POSITION = vec2(0);
        `,
        "vs:main": `
        `,
        "vs:#main-start": `
          drop = float(instanceSourcePositions.xy == DROP_POSITION || instanceTargetPositions.xy == DROP_POSITION);
        `,
        "vs:#main-end": `
          positionWind = instanceTargetPositions.xy;
        `,
        "fs:#decl": `
          varying float drop;
          varying vec2 positionWind;
          uniform sampler2D uWind;
          uniform sampler2D colorTexture;
          uniform vec4 bounds;
          uniform float uWindMin;
          uniform float uWindMax;
          uniform float vWindMin;
          uniform float vWindMax;
          vec2 getUV(vec2 pos) {
            return vec2(
              (pos.x - bounds[0]) / (bounds[2] - bounds[0]),
              (pos.y - bounds[3]) / (bounds[1] - bounds[3])
            );
          }
        `,
        "fs:#main-start": `
          if (drop > 0.5) discard;
        `,
        "fs:#main-end": `
          vec2 windUV = getUV(positionWind.xy);
          vec2 windMax = vec2(uWindMax, vWindMax);
          vec2 windMin = vec2(uWindMin, vWindMin);
          vec2 velocity = mix(windMin, windMax, texture2D(uWind, windUV).xy);
          float speed = length(velocity);
          float maxSpeed = length(windMax);
          float colorPos = speed / maxSpeed;

          gl_FragColor = vec4(texture2D(colorTexture, vec2(colorPos, 0.)).rgb, gl_FragColor.a);
        `
      }
    });
  }
  initializeState() {
    super.initializeState({});
    this._setupTransformFeedback();
    const attributeManager = this.getAttributeManager();
    attributeManager == null ? void 0 : attributeManager.remove(["instanceSourcePositions", "instanceTargetPositions", "instanceColors", "instanceWidths"]);
  }
  updateState({ props, oldProps, changeFlags }) {
    super.updateState({ props, oldProps, changeFlags });
    if (props.image !== oldProps.image || props.numParticles !== oldProps.numParticles || props.maxAge !== oldProps.maxAge || props.colors !== oldProps.colors || props.width !== oldProps.width || props.uWindMin !== oldProps.uWindMin || props.uWindMax !== oldProps.uWindMax || props.vWindMin !== oldProps.vWindMin || props.vWindMax !== oldProps.vWindMax) {
      this._setupTransformFeedback();
    }
  }
  finalizeState() {
    this._deleteTransformFeedback();
    super.finalizeState();
  }
  draw({ uniforms }) {
    const { animate, image, bounds, uWindMin, uWindMax, vWindMin, vWindMax } = this.props;
    const { sourcePositions, targetPositions, sourcePositions64Low, targetPositions64Low, widths, model, colorTexture, instanceColors } = this.state;
    if (animate) {
      this._runTransformFeedback();
    }
    model.setAttributes({
      instanceSourcePositions: sourcePositions,
      instanceTargetPositions: targetPositions,
      instanceSourcePositions64Low: sourcePositions64Low,
      instanceTargetPositions64Low: targetPositions64Low,
      instanceColors,
      instanceWidths: widths
    });
    model.setUniforms({
      uWind: image,
      colorTexture,
      bounds,
      uWindMin,
      uWindMax,
      vWindMin,
      vWindMax
    });
    super.draw({ uniforms });
    this.setNeedsRedraw();
  }
  _setupTransformFeedback() {
    const { gl } = this.context;
    const { numParticles, maxAge, colors, width } = this.props;
    const { initialized } = this.state;
    if (initialized) {
      this._deleteTransformFeedback();
    }
    const numInstances = numParticles * maxAge;
    const numAgedInstances = numParticles * (maxAge - 1);
    const sourcePositions = new Buffer2(gl, new Float32Array(numInstances * 3));
    const targetPositions = new Buffer2(gl, new Float32Array(numInstances * 3));
    const sourcePositions64Low = new Float32Array([0, 0, 0]);
    const targetPositions64Low = new Float32Array([0, 0, 0]);
    const instanceColors = new Buffer2(gl, new Float32Array(new Array(numInstances).fill(void 0).map((_, i) => {
      const age = Math.floor(i / numParticles);
      return [255, 255, 255, 255 * (1 - age / maxAge)].map((d) => d / 255);
    }).flat()));
    const widths = new Float32Array([width]);
    const transform = new Transform(gl, {
      sourceBuffers: {
        sourcePosition: sourcePositions
      },
      feedbackBuffers: {
        targetPosition: targetPositions
      },
      feedbackMap: {
        sourcePosition: "targetPosition"
      },
      vs: updateTransformVs,
      elementCount: numInstances
    });
    const colorTexture = new Texture2D(gl, {
      data: this.getColorRamp(colors)
    });
    this.setState({
      initialized: true,
      numInstances,
      numAgedInstances,
      sourcePositions,
      targetPositions,
      sourcePositions64Low,
      targetPositions64Low,
      instanceColors,
      widths,
      transform,
      colorTexture
    });
  }
  _runTransformFeedback() {
    const { viewport, timeline } = this.context;
    const { image, bounds, numParticles, speedFactor, maxAge, boundsClip } = this.props;
    const { numAgedInstances, transform } = this.state;
    if (!image) {
      return;
    }
    const viewportSphere = viewport.resolution ? 1 : 0;
    const viewportSphereCenter = [viewport.longitude, viewport.latitude];
    const viewportSphereRadius = Math.max(distance(viewportSphereCenter, viewport.unproject([0, 0]), { units: "meters" }), distance(viewportSphereCenter, viewport.unproject([viewport.width / 2, 0]), { units: "meters" }), distance(viewportSphereCenter, viewport.unproject([0, viewport.height / 2]), { units: "meters" }));
    const viewportBounds = viewport.getBounds();
    viewportBounds[1] = Math.max(viewportBounds[1], -85.051129);
    viewportBounds[3] = Math.min(viewportBounds[3], 85.051129);
    const devicePixelRatio = window.devicePixelRatio;
    const viewportSpeedFactor = speedFactor * devicePixelRatio / 2 ** viewport.zoom;
    const sourcePositions = transform.bufferTransform.bindings[transform.bufferTransform.currentIndex].sourceBuffers.sourcePosition;
    const targetPositions = transform.bufferTransform.bindings[transform.bufferTransform.currentIndex].feedbackBuffers.targetPosition;
    sourcePositions.copyData({
      sourceBuffer: targetPositions,
      readOffset: 0,
      writeOffset: numParticles * 4 * 3,
      size: numAgedInstances * 4 * 3
    });
    const uniforms = {
      speedTexture: image,
      bounds,
      numParticles,
      maxAge,
      viewportSphere,
      viewportSphereCenter,
      viewportSphereRadius,
      viewportBounds: boundsClip ? clipBox(viewportBounds, bounds) : viewportBounds,
      viewportSpeedFactor,
      time: timeline.getTime(),
      seed: Math.random()
    };
    transform.run({ uniforms });
    transform.swap();
  }
  _deleteTransformFeedback() {
    const { initialized, sourcePositions, targetPositions, instanceColors, transform } = this.state;
    if (!initialized) {
      return;
    }
    sourcePositions.delete();
    targetPositions.delete();
    instanceColors.delete();
    transform.delete();
    this.setState({
      initialized: false,
      sourcePositions: void 0,
      targetPositions: void 0,
      sourcePositions64Low: void 0,
      targetPositions64Low: void 0,
      instanceColors: void 0,
      widths: void 0,
      transform: void 0,
      colorTexture: void 0
    });
  }
  step() {
    this._runTransformFeedback();
    this.setNeedsRedraw();
  }
  clear() {
    const { numInstances, sourcePositions, targetPositions } = this.state;
    sourcePositions.subData({ data: new Float32Array(numInstances * 3) });
    targetPositions.subData({ data: new Float32Array(numInstances * 3) });
    this.setNeedsRedraw();
  }
  getColorRamp(colors) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 1;
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    for (const stop in colors) {
      gradient.addColorStop(+stop, colors[stop]);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);
    return canvas.toDataURL();
  }
}
ParticleLayer.layerName = "ParticleLayer";
ParticleLayer.defaultProps = defaultProps;
export { ParticleLayer };
