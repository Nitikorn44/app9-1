const express = require("express")
const app = express();
const Student = require('./model')
const post = 8000;
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/api/db/create', (request, response) => {
    let form = request.body
    let data = {
        stdId: form.stdId,
        stdName: form.stdName,
        stdGrade: form.stdGrade
    }
    Student.create(data, err => {
        if (!err) {
            console.log('document saved')
            response.send(true)
        } else {
            console.log('error')
            response.send(false)
        }
    })
})

app.get('/api/db/read', (request, response) => {
    Student
        .find()
        .exec((err, docs) => {
            response.json(docs)
        })
})

app.post('/api/db/update', (request, response) => {
    let form = request.body
    let data = {
        stdId: form.stdId || '',
        stdName: form.stdName || '',
        stdGrade: form.stdGrade || 0,
    }

    Student
        .findByIdAndUpdate(form._id, data, { useFindAndModify: false })
        .exec(err => {
            if (err) {
                response.json({ error: err })
                return
            }
        })
    //หลังการอัปเดต ก็อ่านข้อมูลอีกครั้ง แล้วส่งไปแสดงผลที่ฝั่งโลคอลแทนข้อมูลเดิม
    Student
        .find()
        .exec((err, docs) => {
            response.json(docs)
        })
})

app.post('/api/db/delete', (request, response) => {
    let _id = request.body._id

	Student
	.findByIdAndDelete(_id, { useFindAndModify: false })
	.exec(err => {
        if (err) {
            response.json({error: err})
            return
        }
    })		

    Student
    .find()     
    .exec((err, docs) => {
        response.json(docs)
    })
})

app.get('/api/db/paginate', (request, response) => {
	let options = {
		page: request.query.page || 1,     //เพจปัจจุบัน
		limit: 2     //แสดงผลหน้าละ 2 รายการ (ข้อมูลมีน้อย)            
	}

	Student.paginate({}, options, (err, result) => {
        response.json(result)
    })
})

app.get('/api/db/search', (request, response) => {
    let q = request.query.q || ''

    //กรณีนี้ให้กำหนด pattern ด้วย RegExp แทนการใช้ / /
    let pattern = new RegExp(q, 'ig')   

    //จะค้นหาจากฟิลด์ name และ detail
    let conditions = {$or: [        
                        {stdId: {$regex: pattern}}, 
                        {stdName: {$regex: pattern}},
                        {stdGrade: {$regex: pattern}}
                     ]}	

    let options = {
		page: request.query.page || 1,     //เพจปัจจุบัน
		limit: 2     //แสดงผลหน้าละ 2 รายการ (ข้อมูลมีน้อย)               
	}

	Student
	.paginate(conditions, options, (err, result) => {
        response.json(result)
    })
})

app.listen(post, () => {
    console.log('Sever listen on post' + post);
})