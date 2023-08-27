$(document).ready(function(){
    $.get("/api/companys", async (data, status) => {
        let companys = data.datas
        companys.forEach(company => {
            $(".jobs").append(`
            <div class="job">
                <input type="hidden" name="" value="${company.id}">
                <b>${company.Jobs[0].job_title}</b>
                <p><i class="uil uil-building"></i> ${company.company_name}</p>
                <p><i class="uil uil-location-point"></i> ${company.company_location}</p>
                <ul class="text-secondary">
                    <li>${company.Jobs[0].job_description.substring(0,280)}</li>
                </ul>
                <p class="text-secondary fs-6">posted today</p>
            </div>
            `)
        });
    })
    $(".jobs").on("click",".job", function(){
        let id = $(this).find('input').val();
        $.get(`/api/companys/${id}`, async (data, status) => {
            let company = data.datas
            $(".jobs-info").html(`
            <div class="job-info">
                <div class="job-apply mb-5">
                    <h4>${company.Jobs[0].job_title}</h4>
                    <p><i class="uil uil-building"></i> ${company.company_name}</p>
                    <p><i class="uil uil-location-point"></i> ${company.company_location}</p>
                    <form class="d-flex gap-2" role="search">
                    <a href="/jobseeker/apply"><button class="btn btn-primary px-4 py-2" type="button">Apply Now</button></a>
                    <button class="btn btn-secondary" type="submit"><i class="uil uil-bookmark fs-6"></i></button>
                    </form>
                </div>
                <hr>
                <div class="job-desc overflow-y-scroll">
                    <h4>Job Detail</h4>
                    <p>${company.Jobs[0].job_description}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati voluptatem earum, tempora doloribus atque natus error deleniti consequuntur quidem nemo quae dolore ipsam similique molestias voluptate ad animi! Esse ducimus, eaque nulla quidem iusto quisquam laboriosam. Odit iste illum optio, aliquid fugit ducimus pariatur voluptas, quas quos consequatur ratione in soluta cupiditate dolor nobis fuga quaerat consectetur nesciunt. In, obcaecati tenetur quibusdam nesciunt porro autem accusamus assumenda velit dolores. Ullam iste vel enim necessitatibus, quod, officiis porro fugiat eos atque sit eum, distinctio iusto. Repudiandae mollitia illo quidem, porro voluptatem dolorem minus aliquid voluptate quibusdam facilis cumque necessitatibus. Sed, voluptates.</p>
                </div>
            </div>
            `)
        })
    })
})