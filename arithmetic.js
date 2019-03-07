/*
四则运算编译
问题描述:

实现函数arithmetic，要求对输入的四则运算的字符串进行解析执行，并输出对应执行结果 (例如输入"3+4*(5+2)"，arithmetic("3+4*(5+2)")输出运算结果31)

输入:(四则运算字符串)
13+4*(5+11)

输出:(字符串执行结果)
77

算法简介：
考查词法解析和语法解析，可以通过构建递归下降算法解决

代码样例:*/

function lexical(str) {
    let index = 0
    let stack=[]
    let offset=0

    return function (type=0) {

        if(type==-1){
            offset--
            return
        }

        if(offset<stack.length){
            return stack[offset++]
        }

        for (; index < str.length; index++) {
            if (str[index] != ' ') {
                break
            }
        }

        if (index >= str.length) {
            return ['$', '$']
        }

        switch (str[index]) {
            case "(":{
                index++
                offset++
                stack.push(["(","("])
                return stack[stack.length-1]
            }
            case ")":{
                index++
                offset++
                stack.push([")",")"])
                return stack[stack.length-1]
            }
            case "+":{
                index++
                offset++
                stack.push(["add","+"])
                return stack[stack.length-1]
            }
            case "-":{
                index++
                offset++
                stack.push(["add","-"])
                return stack[stack.length-1]
            }
            case "*":{
                index++
                offset++
                stack.push(["mul","*"])
                return stack[stack.length-1]
            }
            case "/":{
                index++
                offset++
                stack.push(["mul","/"])
                return stack[stack.length-1]
            }
            default:{
                var items=[]
                for(;index<str.length;index++){
                    if(str.charCodeAt(index)<48||str.charCodeAt(index)>57){
                        break
                    }

                    items.push(str[index])
                }
                offset++
                stack.push(["num",parseInt(items.join(""))])
                return stack[stack.length-1]
            }
        }
    }
}

//根据文法构建递归下降算法(也可以通过栈来构建算法)
/**
 expr->term exprTail
 exprTail->add term exprTail|Φ
 term->factor termTail
 termTail->mul factor termTail|Φ
 factor->(expr)|num
 *
 * */

function add(op,l,r) {
    if(op=='+')
        return l+r
    return l-r
}

function mul(op,l,r) {
    if(op=='*')
        return l*r
    return l/r
}

function factor(lexical){
    let lex=lexical()

    if(lex[0]=='num'){
        return lex[1]
    }else if (lex[0] == '(') {
        let result=expr(lexical)
        lexical()
        return result
    }
}

function  termTail(data,lexical){
    let lex=lexical()

    if(lex[0]!='mul'){
        lexical(-1)//回退一位
        return data
    }

    return termTail(mul(lex[1],data,factor(lexical)),lexical)
}

function term(lexical){
    return termTail(factor(lexical),lexical)
}

function exprTail(data,lexical){
    let lex=lexical()

    if(lex[0]!='add'){
        lexical(-1)//回退一位
        return data
    }

    return exprTail(add(lex[1],data,term(lexical)),lexical)
}

function expr(lexical) {
    return exprTail(term(lexical),lexical)
}

//入口函数
function arithmetic(str) {
    let result=expr(lexical(str))
    return result
}

console.log(arithmetic("3+4*(5+2)"))