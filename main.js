//获取用户提交的数据并且将数据通过AJAX请求上传
let hash = {}
let $form = $('#signUpForm')
$('#signUpForm').on('submit',(e)=>{
    e.preventDefault()
    let names = ['email','password','password_confirm']
    names.forEach((name)=>{
        //需要查看find用法
       let value =  $('#signUpForm').find(`[name=${name}]`).val()
       hash[name] = value
    })
    //以下验证表单,在post之前
    //前面找到伪数组，元素的集合
    //return后不执行,$(span)，找到span对象
    $('#signUpForm').find('.error').each((index,span)=>{
        $(span).text('')
})
    
   
    if(hash['email'] === ''){
        $('#signUpForm').find('[name = "email"]').siblings('.error')
        .text('请填写邮箱')
        return
    }
    if(hash['password'] === ''){
        $('#signUpForm').find('[name = "password"]').siblings('.error')
        .text('请填写密码')
        return
    }
    if(hash['password_confirm'] ===''){
        $('#signUpForm').find('[name = "password_confirm"]').siblings('.error').text('请确认密码')
        return
    }
    if(hash['password'] !== hash['password_confirm']){
        $('#signUpForm').find('[name = "password_confirm"]').siblings('.error').text('密码不一致')
        return
    }
    
    $.post('/sign_up',hash)
    .then((response)=>{
        location.href = 'http://baidu.com'
    },(a)=>{
        // console.log(a.responseText)
        // let {errors} = request.responseJSON
        // console.log(errors)
        let {errors} = JSON.parse(a.responseText)
        console.log(errors)
        if(errors.email && errors.email === 'invalid'){
            // alert('你的邮箱输错了')
            $('#signUpForm').find('[name=email]').siblings('.error')
            .text('你的邮箱输错了')
        }else if(errors.email === 'inUse'){
            // alert('你的邮箱输错了')
            $('#signUpForm').find('[name=email]').siblings('.error')
            .text('邮箱被占用')
        }
    })
})
