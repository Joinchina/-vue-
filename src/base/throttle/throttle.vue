<script>

    /**
     * @Author ChangJian
     * @description: 1.绑定原生事件无问题; 2.$emit触发父组件事件暂不确定会不会出现bug(目前未发现)；
     * 
     */

    /** 
     * 节流函数
     *
     * @param {action}  触发函数
     * @param {wait}  间隔时间  ms
     * @param {isDebounce} 是否切换为防抖模式  true->防抖   false->节流
     * @param {ctx} 抽象包裹的vnode（不需要传入）
     * 
     * 
    */
    const throttle = (action,wait=50,isDebounce,ctx)=>{
        let timer = null;
        let lastActive = 0;
        return function(...params){
            if(isDebounce){
                if(timer)
                    clearTimeout(timer)
                timer = setTimeout(()=>{
                    action.apply(ctx,params);
                },wait)
            }else{
                const now = new Date().getTime();
                if(now-lastActive>wait){
                    lastActive = now;
                    action.apply(ctx,params);
                }
            }
        }
        
    }
    export default {
        name:"Throttle",
        abstract:true,
        props:{
            wait:Number,
            isDebounce:{
                type: Boolean,
                default: false,
            },
            events: {
                type:String,
                default:''
            },
        },
        created(){
            this.eventKeys = this.events.split(",");
            this.originMap = {};
            this.throttledMap = {};
        },
        render(createdEl){
            try{
                if(!this.$slots.default) return
                const vnode = this.$slots.default[0];
            
                for(let key of this.eventKeys){
                    const target = vnode.data.on&&vnode.data.on[key];
                    if(target===this.originMap[key]&&this.throttledMap[key]){
                        vnode.data.on[key] = this.throttledMap[key]
                    }else if(target){
                        this.originMap[key] = target;
                        this.throttledMap[key] = throttle(target,this.wait,this.isDebounce,vnode);
                        vnode.data.on[key] = this.throttledMap[key];
                    }else if(target==undefined&&vnode.componentOptions&&vnode.componentOptions.listeners&&vnode.componentOptions.listeners[key]){
                        /**
                         * 适配$emit触发父组件事件
                         * 处理vueComponent的listeners监听事件
                         */
                        vnode.componentOptions.listeners[key] = throttle(vnode.componentOptions.listeners[key],this.wait,this.isDebounce,vnode);
                    }
                }
                
                return vnode
            }catch(err){
                let errInfo = new Error(err)
                throw errInfo
            }
        }
    }
</script>