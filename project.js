import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Textured_Phong} = defs

class Line extends Shape {
    constructor() {
        super("position", "color");
        this.arrays.position = [
            [0,0,0], [1,0,0] 
            ];
            
        const white = hex_color("#ffffff");
        this.arrays.color = Array(2).fill(white);
        this.indices = false;
    }
}

export class Project extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        //Environment
        this.floor_tran = Mat4.identity().times(Mat4.translation(0,-10,0))
                                         .times(Mat4.rotation(Math.PI*1/2, -1, 0, 0))
                                         .times(Mat4.scale(200, 200, 200));
        this.mtn_tran = Mat4.identity().times(Mat4.rotation(Math.PI*1/2, -1, 0, 0));

        this.night = false;
        this.snow = false;
        this.sky_tran = Mat4.identity().times(Mat4.translation(0, 80, -100))
                                       .times(Mat4.scale(200,100,1));

        this.sun_tran = Mat4.identity().times(Mat4.translation(0, 60, -95))
                                       .times(Mat4.scale(20, 20, 1));

        this.pond_tran = Mat4.identity().times(Mat4.translation(0,-9.5,80))
                                        .times(Mat4.rotation(Math.PI*1/2, -1, 0, 0))
                                        .times(Mat4.scale(10, 10, 1));

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            snow: new defs.Triangle(),
            tornado: new defs.Cone_Tip(3, 20, [[0, 1], [0, 1]]),
            debris1: new defs.Cube(),
            debris2: new defs.Subdivision_Sphere(1),
            debris3: new defs.Triangle(),
            rain: new defs.Rounded_Capped_Cylinder(3, 15, [[0, 1], [0, 1]]),
            wind: new defs.Square(),

            bolt: new Line(),
            square: new defs.Cube(),
            triangle: new defs.Rounded_Capped_Cylinder(10,3),
            cylinder: new defs.Rounded_Capped_Cylinder(10,40),
            conic: new defs.Closed_Cone(10,6),

            mtn:  new defs.Rounded_Closed_Cone(5,5),
            floor: new defs.Square(100, 100),
            pond: new defs.Regular_2D_Polygon(10,10),
            sky: new defs.Square(100, 100),
        };

        // *** Materials
        this.materials = {
            sky: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#87ceeb")}),
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            ring: new Material(new Ring_Shader(), 
                {ambient: 0, color: hex_color("#b87d11")}),
            // TODO:  Fill in as many additional material objects as needed in this key/value table.
            //        (Requirement 4)
            glue: new Material(new defs.Phong_Shader(),
                {ambient: .2, diffusivity: .6, color: hex_color("#ffffff")}),
            fan: new Material(new defs.Phong_Shader(),
                {ambient: .2, diffusivity: .6, color: hex_color("#ffffff")}),

            phong: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
            }),
            snow_rock: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/rock.jpg")
            }),
            rock: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/rock3.png")
            }),
            pond: new Material(new Texture_Scroll_X(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/pond.jpg")
            }),
            night_sky: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/night_sky.jpg")
            }),
            moon: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/moon.png")
            }),
            grass: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/grass.png")
            }),
            snow_grass: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/snow_grass.png")
            }),

            snow: new Material(new defs.Phong_Shader(), 
                {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#c7dcff")}),
            rain: new Material(new defs.Phong_Shader(), 
                {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#ffffff")}),
            wind: new Material(new defs.Phong_Shader(), 
                {ambient: 0.5, diffusivity: 0, specularity: 0.3, color: hex_color("#ffffff", 0.3)}),
            tornado: new Material(new Textured_Phong(), 
                {ambient: 1, diffusivity: 0, specularity: 0.3, color: hex_color("000000"), texture: new Texture("assets/tornado.png")}),
            cloud: new Material(new defs.Phong_Shader(), 
                {ambient: 1, diffusivity: 0.2, color: hex_color("#808080")}),
            bolt: new Material(new defs.Basic_Shader(), {color: hex_color("#E8DAEF")}),

        };

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

        this.wind = [0, 3];

        this.snow_list = [];
        this.rain_list = [];
        this.wind_list = [];
        this.gust_active = false;

        this.tornado_loc = [-20, -5];
        this.tornado_dt = 0;
        this.circle = false;

        this.wind = (0, 0, 0, 1);
        this.snow_dt = 0;
        this.rain_dt = 0;
        this.wind_dt = 0;
        this.gust_dt = 0;
        this.bolt = null;
        
        this.rot_trigger = 0;
        this.curr_rot = 0;
        this.rot_speed = 0;
        this.time_elapsed = 0;
        this.time_snapshot = 0;
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View solar system", ["N", "0"], () => this.attached = () => this.wind = (0, 0, 0, this.wind[3]));
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["S", "1"], () => this.attached = () => this.wind);
        this.key_triggered_button("Attach to planet 2", ["E", "2"], () => this.attached = () => this.planet_2);
        this.new_line();
        this.key_triggered_button("Attach to planet 3", ["W", "3"], () => this.attached = () => this.planet_3);
        this.key_triggered_button("Attach to planet 4", ["Wind Intensity + 1", "w"], () => this.attached = () => this.planet_4);
        this.new_line();
        this.key_triggered_button("Attach to moon", ["Wind Intensity - 1", "m"], () => this.attached = () => this.moon);
        this.new_line();
        this.key_triggered_button("Day/Night", ["n"], () => {this.night ^= 1;});
        this.new_line();
        this.key_triggered_button("Snow/No Snow", ["n"], () => {this.snow ^= 1;});
    }

    windpx(){
        this.rot_trigger = 1;
    }

    windnx(){
        this.rot_trigger = 2;
    }

    stopwind(){
        this.rot_trigger = 0;
    }

    immediatestop(){this2
        this.rot_trigger = 3;
    }

    gust(){
        this.rot_trigger = 4;
    }

    generate_snow(context, program_state, initial_transform, t, dt, wind){
        this.snow_list.forEach((element, index) => {
            let delta_time = t-element[4];
            let f = 10*Math.sin(Math.PI/10*(delta_time)-Math.PI/2)+5;

            let dx = Math.cos(wind[0]/180*Math.PI)*wind[1]*delta_time;
            let dz = Math.sin(wind[0]/180*Math.PI)*wind[1]*delta_time;


            let snow_transform = initial_transform.times(Mat4.translation(20*element[0]+dx, 10-f+element[1], 10*element[2]-dz)).times(Mat4.scale(0.1, 0.1, 0.1));
            snow_transform = snow_transform.times(Mat4.rotation(element[3]+f*Math.PI/2, 1, 1, 1));
            this.shapes.snow.draw(context, program_state, snow_transform, this.materials.snow);
            if((10 - f + element[1]) < 0){
                this.snow_list.splice(index, 1);
            }
        });
        
        if(this.snow_dt > 0.5){
            for(let i = 0; i < 40; i++){
                let x = 2*Math.random()-1;
                let z = 2*Math.random()-1;
                let y = 3*Math.random();
                let r = Math.random();
        
                let snow_transform = initial_transform.times(Mat4.translation(20*x, 10+y, 10*z)).times(Mat4.scale(0.1, 0.1, 0.1)).times(Mat4.rotation(r, 1, 1, 1));
                this.snow_list.push(Array(x, y, z, r, t));
                this.shapes.snow.draw(context, program_state, snow_transform, this.materials.snow);
            }
        } else {
            this.snow_dt += dt;
        }
        
    }

    generate_wind(context, program_state, initial_transform, t, dt, wind){
        let x = Math.cos(wind[0]/180*Math.PI);
        let z = -Math.sin(wind[0]/180*Math.PI);

        let px = Math.cos(wind[0]/180*Math.PI + Math.PI/2);
        let pz = Math.sin(wind[0]/180*Math.PI + Math.PI/2);

        this.wind_list.forEach((element, index) => {
            let delta_time = t-element[4];

            let dx = x*delta_time*20;
            let dz = z*delta_time*20;
            let dy = Math.sin(element[2])*delta_time*20;

            let wind_transform = initial_transform.times(Mat4.translation((-20+element[3])*x + element[0]*px + dx, 10*element[1]+dy, (20 - element[3])*z - element[0]*pz + dz));
            wind_transform = wind_transform.times(Mat4.rotation(wind[0], 0, 1, 0));
            wind_transform = wind_transform.times(Mat4.rotation(2*delta_time, 1, 0, 0)).times(Mat4.scale(2, 0.1, 1));
            this.shapes.wind.draw(context, program_state, wind_transform, this.materials.rain);
            
            if(delta_time > 5){
                this.wind_list.splice(index, 1);
            }
        });
        
        if(this.wind_dt > 3){
            this.wind_dt = 0;
            for(let i = 0; i < 3; i++){
                let w = 2*Math.random()-1;
                let h = Math.random();
                let ay = (2*Math.random()-1) * Math.PI/16;
                let d = 10*Math.random()-5;
        
                let wind_transform = initial_transform.times(Mat4.translation((20 + d)*x + w*px, 10*h, (20 + d)*z - w*pz)).times(Mat4.rotation(wind[0], 0, 1, 0)).times(Mat4.scale(2, 0.1, 1));
                this.wind_list.push(Array(w, h, ay, d, t));
                this.shapes.wind.draw(context, program_state, wind_transform, this.materials.wind);
            }
        } else{
            this.wind_dt += dt;
        }

        if(this.gust_active){
            this.gust_dt += dt;

        } 
    }

    generate_gust(context, program_state){

    }

    generate_rain(context, program_state, initial_transform, t, dt, wind){
        let rain_angle = Math.PI/4*(wind[1]/10);

        this.rain_list.forEach((element, index) => {
            let delta_time = t-element[3];
            let f = 10*Math.sin(Math.PI/3*(delta_time)-Math.PI/2)+5;

            let dx = Math.cos(wind[0]/180*Math.PI)*wind[1]*delta_time;
            let dz = Math.sin(wind[0]/180*Math.PI)*wind[1]*delta_time;

            let rain_transform = initial_transform.times(Mat4.translation(20*element[0]+dx, 10-f+element[1], 10*element[2]-dz)).times(Mat4.rotation(Math.PI/2 + wind[0]/180*Math.PI, 0, 1, 0));
            rain_transform = rain_transform.times(Mat4.rotation(Math.PI/2-rain_angle, 1, 0, 0)).times(Mat4.scale(0.01, 0.01, 0.6));
            this.shapes.rain.draw(context, program_state, rain_transform, this.materials.rain);
            if(10-f+element[1] < 0){
                this.rain_list.splice(index, 1);
            }
        });
        
        if(this.rain_dt > 0.5){
            this.rain_dt = 0;
            for(let i = 0; i < 80; i++){
                let x = 2*Math.random()-1;
                let z = 2*Math.random()-1;
                let y = 5*Math.random();
        
                let rain_transform = initial_transform.times(Mat4.translation(20*x, 10+y, 15*z)).times(Mat4.rotation(Math.PI/2 - wind[0]/180*Math.PI, 0, 1, 0))
                rain_transform = rain_transform.times(Mat4.rotation(Math.PI/2-rain_angle, 1, 0, 0)).times(Mat4.scale(0.01, 0.01, 0.6));
                this.rain_list.push(Array(x, y, z, t));
                this.shapes.rain.draw(context, program_state, rain_transform, this.materials.rain);
            }
        } else{
            this.rain_dt += dt;
        }
    }

    generate_cloud(context, program_state, model_transform){
        let cloud_transform = model_transform;

        let c1t = cloud_transform.times(Mat4.scale(2.2,2,2.2));
        this.shapes.sphere.draw(context, program_state, c1t, this.materials.cloud);

        let c2t = cloud_transform.times(Mat4.translation(-2, 0, 0));
        c2t = c2t.times(Mat4.scale(1.75, 1.5, 1.5));
        this.shapes.sphere.draw(context, program_state, c2t, this.materials.cloud);

        let c3t = cloud_transform.times(Mat4.translation(2, 0, 0));
        c3t = c3t.times(Mat4.scale(1.75,1.5,1.5));
        this.shapes.sphere.draw(context, program_state, c3t, this.materials.cloud);
        /*
        let c4t = cloud_transform.times(Mat4.translation(-3.5, 0, 0));
        c4t = c4t.times(Mat4.scale(1,1,1));
        this.shapes.sphere.draw(context, program_state, c4t, this.materials.cloud);

        let c5t = cloud_transform.times(Mat4.translation(3.5, 0, 0));
        c5t = c5t.times(Mat4.scale(2, 1, 1));
        this.shapes.sphere.draw(context, program_state, c5t, this.materials.cloud);*/
    }

    gernerate_bolt(gen){
        let ys = 12;
        let xs = (2*Math.random()-1)*10;
        let xd = (2*Math.random()-1)*5;
        let yd = -5;

        let bolt_path = [];
        let z = 0;

        bolt_path.push([vec3(xs, ys, z), vec3(xd, yd, z)]);
        let maxoffset = 3;
        for(let i = 0; i < gen; i++){
            let new_bolt = [];
            bolt_path.forEach((element) => {
                
                let midpt = element[0].plus(element[1]);
                midpt.scale_by(0.5);
                let v = element[1].minus(element[0]);
                
                let dv = v.normalized();
                
                let dvx = dv[0];
                dv[0] = dv[1];
                dv[1] = -dvx;
                
                let offset = maxoffset*2*Math.random()-maxoffset;
                dv.scale_by(offset);
                midpt = midpt.plus(dv);
                let ls1 = [element[0], midpt];
                let ls2 = [midpt, element[1]];
                new_bolt.push(ls1, ls2);

                let branch_probability = Math.random();
                if(branch_probability > 0.5){
                    let dir = midpt.minus(element[0]);
                    let length = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
                    let angle = Math.atan(dir[1]/dir[0]);
                    if(dir[0] < 0){
                        angle -= Math.PI;
                    }
                    console.log(angle*180/Math.PI);
                    angle += (2*Math.random()-1)*Math.PI/8;
                    let lscaled = length*0.8;
                    let splitpt = midpt.plus(vec3(Math.cos(angle)*lscaled, Math.sin(angle)*lscaled, 0));
                    
                    let ls3 = [midpt, splitpt];
                    new_bolt.push(ls3);
                }
            });
            maxoffset /= 2;
            bolt_path = new_bolt;
        }
        this.bolt = bolt_path;
    }

    draw_bolt(context, program_state, gen){
        if(this.bolt == null){
            this.gernerate_bolt(gen);
        }
        
        this.bolt.forEach((element) => {
            let v = element[1].minus(element[0]);
            let length = Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2));

            let angle = Math.atan(v[1]/v[0]);
            if(v[0] < 0){
                angle -= Math.PI;
            }

            let bolt_translation = Mat4.identity().times(Mat4.translation(element[0][0], element[0][1], -20));
            bolt_translation = bolt_translation.times(Mat4.rotation(angle, 0, 0, 1));
            bolt_translation = bolt_translation.times(Mat4.scale(length,1,1));
        
            this.shapes.bolt.draw(context, program_state, bolt_translation, this.materials.bolt, "LINES");
        });
        this.shapes.circle.draw(context, program_state, Mat4.identity().times(Mat4.rotation(Math.PI/2, 0,0,1)),this.materials.test);
    }

    tornado_path(dt){
        let speed = 5;
       
        if(!this.circle && this.tornado_loc[1] == -5){
            if(this.tornado_loc[0] >= 0){
                this.tornado_loc = [0, -5];
                this.circle = true;
            } else{
                this.tornado_loc[0] += speed*dt;
            }
        } else{
            if(this.tornado_dt > 5){
                this.tornado_loc[0] += speed*dt;
            } else {
                let x = 5*Math.sin(2/5*Math.PI*this.tornado_dt);
                let z = -5*Math.cos(2/5*Math.PI*this.tornado_dt);
                this.tornado_loc = [x,z];
            }
            this.tornado_dt += dt;
        }
        
    }

    generate_tornado(context, program_state, initial_transform, t, dt){
        this.tornado_path(dt);
        let start_transform = initial_transform.times(Mat4.rotation(Math.PI/2, 1, 0, 0)).times(Mat4.translation(this.tornado_loc[0], 0, this.tornado_loc[1])).times(Mat4.rotation(3*t, 0, 0, 1));
        let tornado_transform = start_transform;
        tornado_transform = tornado_transform.times(Mat4.scale(3,3,1));

        let debris1_t = start_transform.times(Mat4.translation(0,1,2)).times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.rotation(t, 1, 1, 1));
        this.shapes.debris1.draw(context, program_state, debris1_t, this.materials.test);

        let debris2_t = start_transform.times(Mat4.rotation(2*Math.PI/3, 0,0,1)).times(Mat4.translation(0,2,0)).times(Mat4.scale(0.2, 0.2, 0.2)).times(Mat4.rotation(2*t, 1, 1, 1));
        this.shapes.debris2.draw(context, program_state, debris2_t, this.materials.test);
        
        let debris3_t = start_transform.times(Mat4.rotation(4*Math.PI/3, 0,0,1)).times(Mat4.translation(0,1,5)).times(Mat4.scale(0.5, 0.5, 0.5)).times(Mat4.rotation(2*t, 1, 0, 1));
        this.shapes.debris3.draw(context, program_state, debris3_t, this.materials.test);

        this.shapes.tornado.draw(context, program_state, tornado_transform, this.materials.tornado);
        for(let i = 0; i < 2; i++){
            tornado_transform = tornado_transform.times(Mat4.scale(0.8, 0.8, 1.5));
            tornado_transform = tornado_transform.times(Mat4.translation(0, 0, 0.3));
            this.shapes.tornado.draw(context, program_state, tornado_transform, this.materials.tornado);
        }

        for(let i = 0; i < 4; i++){
            tornado_transform = tornado_transform.times(Mat4.scale(0.65, 0.65, 1.0));
            tornado_transform = tornado_transform.times(Mat4.translation(0, 0, 0.4));
            this.shapes.tornado.draw(context, program_state, tornado_transform, this.materials.tornado);
        }
        tornado_transform = start_transform.times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.translation(0, 0, 5)).times(Mat4.rotation(Math.PI, 0, 1, 0));

        /*
        for(let i = 0; i < 3; i++){
            tornado_transform = tornado_transform.times(Mat4.scale(0.8, 0.8, 1.3));
            tornado_transform = tornado_transform.times(Mat4.translation(0, 0, 0.3));
            this.shapes.cone.draw(context, program_state, tornado_transform, this.materials.test);
        }*/
    }


    calcXZangle(wind){
        if(wind[2] == 1){
            return Math.PI/2;
        } else if(wind[2] == -1){
            return -Math.PI/2;
        } else{
            let angle = Math.atan(wind[2]/wind[0]);
            return wind[0] >= 0 ? angle : angle + Math.PI;
        }
    }

    draw_sky(context, program_state, night) {
        if (night) {
            this.shapes.floor.draw(context, program_state, this.sky_tran, this.materials.night_sky);
            this.shapes.circle.draw(context, program_state, this.sun_tran, this.materials.moon);
        } else {
            this.shapes.floor.draw(context, program_state, this.sky_tran, this.materials.sky);
            this.shapes.circle.draw(context, program_state, this.sun_tran, this.materials.sky.override({color: hex_color("#FDB813")}));
        }
        
    }

    draw_mtn(context, program_state, x){
        let mtn_tran1 = this.mtn_tran.times(Mat4.scale(50, 50, 40))
                                     .times(Mat4.translation(-1+x, 1, 0));
        let mtn_tran2 = this.mtn_tran.times(Mat4.scale(70, 40, 40))
                                     .times(Mat4.translation(0+x, 2, 0));
        let mtn_tran3 = this.mtn_tran.times(Mat4.scale(50, 30, 25))
                                     .times(Mat4.translation(0.5+x, 1.5, 0));
        let mtn_tran4 = this.mtn_tran.times(Mat4.scale(30, 30, 40))
                                     .times(Mat4.translation(2+x, 2.5, 0));
        let mtn_tran5 = this.mtn_tran.times(Mat4.scale(50, 30, 30))
                                     .times(Mat4.translation(-1.75+x,2.75, 0));
        let mtn_tran6 = this.mtn_tran.times(Mat4.scale(50, 30, 40))
                                     .times(Mat4.translation(1.7+x, 1.5, 0));
        let mtn_tran7 = this.mtn_tran.times(Mat4.scale(25, 25, 25))
                                     .times(Mat4.translation(-3.75+x, 2, 0));
        if (this.snow) {
            if(this.night){
                this.shapes.mtn.draw(context, program_state, mtn_tran1, this.materials.snow_rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran2, this.materials.snow_rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran3, this.materials.snow_rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran4, this.materials.snow_rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran5, this.materials.snow_rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran6, this.materials.snow_rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran7, this.materials.snow_rock.override({ ambient: 0.8}));
            } else {
                this.shapes.mtn.draw(context, program_state, mtn_tran1, this.materials.snow_rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran2, this.materials.snow_rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran3, this.materials.snow_rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran4, this.materials.snow_rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran5, this.materials.snow_rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran6, this.materials.snow_rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran7, this.materials.snow_rock);
            }
        } else {
            if(this.night){
                this.shapes.mtn.draw(context, program_state, mtn_tran1, this.materials.rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran2, this.materials.rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran3, this.materials.rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran4, this.materials.rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran5, this.materials.rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran6, this.materials.rock.override({ ambient: 0.8}));
                this.shapes.mtn.draw(context, program_state, mtn_tran7, this.materials.rock.override({ ambient: 0.8}));
            } else {
                this.shapes.mtn.draw(context, program_state, mtn_tran1, this.materials.rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran2, this.materials.rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran3, this.materials.rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran4, this.materials.rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran5, this.materials.rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran6, this.materials.rock);
                this.shapes.mtn.draw(context, program_state, mtn_tran7, this.materials.rock);
            }
        }
        
    }

    draw_floor(context, program_state, snow, night) {
        const grass_green1 = hex_color('#7CFC00');
        const grass_green2 = hex_color("#009A17");
        const grass_green3 = hex_color("#00A619");
        const grass_green4 = hex_color("#008013");
        const grass_green5 = hex_color("#09B051");
        const grass_green6 = hex_color("#59A608");

        if (snow) {
            if(night){
                this.shapes.pond.draw(context, program_state, this.pond_tran, this.materials.pond.override({ ambient: 0.7 }));
                this.shapes.floor.draw(context, program_state, this.floor_tran, this.materials.snow_grass.override({ ambient: 0.85}));
            } else {
                this.shapes.pond.draw(context, program_state, this.pond_tran, this.materials.pond);
                this.shapes.floor.draw(context, program_state, this.floor_tran, this.materials.snow_grass);
            }
        } else {
            if(night){
                this.shapes.pond.draw(context, program_state, this.pond_tran, this.materials.pond.override({ ambient: 0.7 }));
                this.shapes.floor.draw(context, program_state, this.floor_tran, this.materials.grass.override({ ambient: 0.6}));
            } else {
                this.shapes.floor.draw(context, program_state, this.floor_tran, this.materials.grass);
                this.shapes.pond.draw(context, program_state, this.pond_tran, this.materials.pond);
            }
        }
    }

    display(context, program_state) {
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        let model_transform = Mat4.identity();
        
        
        // TODO: Lighting (Requirement 2)
        const light_position = vec4(0, 60, -95, 1); //0,5,5,1
        // The parameters of the Light are: position, color, size
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 100)];
  
        let middle = Mat4.translation(27, 0, 35);
            /*
        let wind_transform = model_transform.times(Mat4.translation(10*t-20, 0, 0));//.times(Mat4.rotation(Math.PI/8, 0, 0, 1))//.times(Mat4.translation(20*element[0]+dx, 10-f+element[1]+dy, 10*element[2]+dz)).times(Mat4.rotation(Math.PI/2 - wind[0]/180*Math/PI, 0, 1, 0));
        wind_transform = wind_transform.times(Mat4.rotation(2*t, 1, 0, 0)).times(Mat4.scale(2, 0.1, 1));
        this.shapes.wind.draw(context, program_state, wind_transform, this.materials.wind);*/

        //this.generate_wind(context, program_state, model_transform, t, dt, [45, 4]);


        /*
        let rain_transform = Mat4.identity().times(Mat4.rotation(0, 0, 1, 0)); //Math.PI/2-rain_angle
        rain_transform = rain_transform.times(Mat4.rotation(Math.PI/4, 1, 0, 0)).times(Mat4.translation(0, 0, 0)).times(Mat4.scale(0.01, 0.01, 0.6));
        this.shapes.rain.draw(context, program_state, rain_transform, this.materials.rain);
        this.shapes.snow.draw(context, program_state, Mat4.identity(), this.materials.snow);*/
        //this.generate_snow(context, program_state, middle, t, dt, [270, 3]);
        //this.generate_rain(context, program_state, middle, t, dt, [135, 10]);
        //this.generate_tornado(context, program_state, model_transform, t, dt);
        //model_transform = model_transform.times(Mat4.rotation(Math.PI/2, 1, 0, 0)).times(Mat4.scale(0.5, 0.5, 1));
        //this.shapes.rain.draw(context, program_state, model_transform, this.materials.rain.override({color: hex_color("#c7e4ee", 1)})); //
        //this.shapes.outline.draw(context, program_state, model_transform, this.materials.rain, "LINES");
        //this.generate_cloud(context, program_state, model_transform);
        
       
        //this.shapes.bolt.draw(context, program_state, Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 1, 0)), this.materials.bolt);
        this.draw_bolt(context, program_state, 5);
        //console.log(this.bolt);
        
        /*
        const fan_axis = Mat4.identity().times(Mat4.translation(27,7,35));

        this.time_elapsed = t;

        //case of trigger positive rotation and rotation speed not there yet
        if (this.rot_trigger == 1 && this.rot_speed <= 0.1){
            this.rot_speed = this.rot_speed + 0.0003;
            if(this.rot_speed > 0)
                this.rot_speed = this.rot_speed + this.rot_speed/70;
        }
        if (this.rot_trigger == 1 && this.rot_speed > 0.1){
            this.rot_speed = this.rot_speed/1.01
        }

        //case of trigger neg rotation and rotation speed not there yet
        if (this.rot_trigger == 2 && this.rot_speed >= -0.1){
            this.rot_speed = this.rot_speed - 0.0003;
            if(this.rot_speed < 0)
                this.rot_speed = this.rot_speed + this.rot_speed/70;
        }

        //case of wind stopping
        if(this.rot_trigger == 0) {
            if (Math.abs(this.rot_speed) > 0.0001) {
                this.rot_speed = this.rot_speed / 1.004;
            }
        }

        //case of instant stop fans for view/debug
        if(this.rot_trigger == 3)
            this.rot_speed = 0;


        if(this.rot_trigger == 4){
            let diff = this.time_elapsed - this.time_snapshot;
            if(diff <= 3 && this.rot_speed <= 1) {
                this.rot_speed = this.rot_speed + diff / 30;
            }
            else{
                this.rot_speed = this.rot_speed/1.01;
            }
        }

        this.curr_rot = this.curr_rot + this.rot_speed;
        let fan1 = fan_axis.times(Mat4.rotation(this.curr_rot, 0, 0, 1))
                .times(Mat4.rotation(-0.8,1,0,0))
                .times(Mat4.scale(2,0.5,0.1))
                .times(Mat4.translation(0.9, 0, 0));

        let fan2 = fan_axis.times(Mat4.rotation(this.curr_rot+2*Math.PI/3, 0, 0, 1))
            .times(Mat4.rotation(-0.8,1,0,0))
            .times(Mat4.scale(2,0.5,0.1))
            .times(Mat4.translation(0.9, 0, 0));

        let fan3 = fan_axis.times(Mat4.rotation(this.curr_rot+4*Math.PI/3, 0, 0, 1))
            .times(Mat4.rotation(-0.8,1,0,0))
            .times(Mat4.scale(2,0.5,0.1))
            .times(Mat4.translation(0.9, 0, 0));

        let triangle_transform = fan_axis.times(Mat4.rotation(this.curr_rot + Math.PI/3, 0,0,1))
            .times(Mat4.scale(0.9,0.9,1.1));

        let circular_axis = fan_axis.times(Mat4.translation(0,0,-1))
            .times(Mat4.scale(0.2,0.2,1));

        let staff = fan_axis.times(Mat4.translation(0,-3,-2))
            .times(Mat4.scale(0.5,4,0.5));

        let cone_test = fan_axis.times(Mat4.translation(0,-2.5,-1.5))
            .times(Mat4.rotation(-Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(2,2,5));

        this.shapes.triangle.draw(context, program_state, triangle_transform, this.materials.glue);
        this.shapes.square.draw(context, program_state, fan1, this.materials.fan.override({color: color(0.3,0.8,0.5,1)}));
        this.shapes.square.draw(context, program_state, fan2, this.materials.fan.override({color: color(0.3,0.5,0.8,1)}));
        this.shapes.square.draw(context, program_state, fan3, this.materials.fan.override({color: color(0.8,0.5,0.3,1)}));

        this.shapes.cylinder.draw(context, program_state, circular_axis, this.materials.glue.override({color: color(0.3,0.3,0.3,1)}));
        //this.shapes.square.draw(context, program_state, staff, this.materials.fan.override({color: hex_color("#65788a")}));

        this.shapes.conic.draw(context, program_state, cone_test, this.materials.fan.override({color: hex_color("#65788a")}));
*/
        this.draw_sky(context, program_state, this.night);
        this.draw_floor(context, program_state, this.snow, this.night);
        this.draw_mtn(context, program_state, -1.5);
        this.draw_mtn(context, program_state, 0.9);
        
    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;

        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;

                vertex_color = vec4(shape_color.xyz * ambient, shape_color.w);
                vertex_color.xyz += phong_model_lights(normalize(N), vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                gl_FragColor = vertex_color;
                return;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            center = model_transform * vec4(0, 0, 0, 1);
            point_position = vec4(position, 1);
            gl_Position = projection_camera_model_transform * vec4(position, 1.0);
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            float factor = sin(distance(point_position.xyz, center.xyz));
            gl_FragColor = factor * vec4(, , , 1.0);
        }`;
    }
}

class Texture_Scroll_X extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #6.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord-vec2(mod(2.0*animation_time,3.0), 0.0));
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}
