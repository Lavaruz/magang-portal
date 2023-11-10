let RECRUITER_ID
let COMPLETION_COUNT = 0
const id = $("#user_id").text()

$.get(`/api/v1/seeker/${id}`, async (seekerData) => {
    RECRUITER_ID = seekerData.recruiter.id
    $("#navbar-seeker-logo").attr("src", seekerData.profile_picture)

    $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {
        $("#basic-org-name").text(recruiterData.rec_org_name)
        $("#basic-org-desc span").text(recruiterData.rec_org_desc)
        $("#basic-org-size").text(recruiterData.rec_org_size)
        $("#basic-org-year").text(recruiterData.rec_org_year)
        $("#basic-org-website").text(`${recruiterData.rec_org_website.length > 28 ? recruiterData.rec_org_website.substring(0, 25) + "..." : recruiterData.rec_org_website}`)
        $("#basic-org-website").attr("href",recruiterData.rec_org_website)
        $("#basic-org-address").text(recruiterData.rec_org_address)
        $("#popup-org-name").val(recruiterData.rec_org_name)
        $("#popup-org-desc").val(recruiterData.rec_org_desc)
        $("#popup-org-size").val(recruiterData.rec_org_size)
        $("#popup-org-year").val(recruiterData.rec_org_year)
        $("#popup-org-website").val(recruiterData.rec_org_website)
        $("#popup-org-address").val(recruiterData.rec_org_address)
        $("#profile-viewers").text(recruiterData.rec_profile_view)


        if(recruiterData.rec_org_logo){
            $("#navbar-org-logo").attr("src", recruiterData.rec_org_logo);
            $("#basic-org-logo").attr("src", recruiterData.rec_org_logo);
            $("#popup-org-logo").attr("src", recruiterData.rec_org_logo);
        }

        if(recruiterData.rec_org_name && recruiterData.rec_org_desc && recruiterData.rec_org_size && recruiterData.rec_org_year && recruiterData.rec_org_website && recruiterData.rec_org_website){
            $("#completion-basic-info").remove()
            COMPLETION_COUNT += 33
        }
        if(recruiterData.rec_description){
            $("#completion-description").remove()
            COMPLETION_COUNT += 33
        }
        if(recruiterData.gallery.length !== 0){
            $("#completion-gallery").remove()
            COMPLETION_COUNT += 33
        }

        if(COMPLETION_COUNT == 99){
            $(".profie-completion").remove()
        }

        $("#completion_rate").text(COMPLETION_COUNT)


        if(recruiterData.rec_banner){
            $("#label-org-banner div").addClass("hidden")
            $("#label-org-banner").css("background-image", `url('${recruiterData.rec_banner}')`)
        }

        if(recruiterData.rec_description){
            let paragraph = recruiterData.rec_description.split('\n')
            $("#description").html(paragraph.join("</br>")).addClass("font-second text-sm text-white-80 font-medium")
            $("#popup-description-textarea").val(`${seekerData.profile_summary}`)
        }

        if(recruiterData.gallery.length !== 0){
            $("#gallery").html("")
            recruiterData.gallery.forEach(photo => {
                $("#gallery").prepend(`
                    <div class="">
                        <div class="overflow-hidden w-[240px] h-[240px] bg-darkest-grey rounded-lg flex justify-center items-center cursor-pointer">
                            <img src="${photo.gal_photo}" alt="profile-picture" class="w-full h-full object-cover">
                        </div>
                    </div>
                `)

                // POPUP GALLERY

                $(`
                    <div>
                        <div class="overflow-hidden w-[240px] h-[240px] bg-darkest-grey rounded-lg flex justify-center items-center cursor-pointer">
                            <img src="${photo.gal_photo}" alt="profile-picture" class="w-full h-full object-cover">
                        </div>
                    </div>
                `).insertBefore($("#popup-add-gallery"))
            })
            if(recruiterData.gallery.length >= 4) $("#popup-add-gallery").remove()
        }









        // update description organisation
        updateSeekerData("form-description", `/api/v1/recruiter/${RECRUITER_ID}`,"PUT")
        
        updateSeekerData("form-org-basic-information", `/api/v1/recruiter/${RECRUITER_ID}`,"PUT")



        // update banner organisation
        $("#input-org-banner").change(function(){
            let selectedImage = this.files[0];
            if(selectedImage){
                updateSeekerData("form-org-banner", `/api/v1/recruiter/${RECRUITER_ID}`,"PUT")
                $(`#form-org-banner`).submit()
            }
        })

        
        $("#button-add-gallery").click(function(){
            $("#input-gallery").click()
        })

        $("#input-gallery").change(function(){
            let selectedImage = this.files[0];
            if(selectedImage){
                const imageUrl = URL.createObjectURL(selectedImage);
                $(`
                    <div>
                        <div class="overflow-hidden w-[240px] h-[240px] bg-darkest-grey rounded-lg flex justify-center items-center cursor-pointer">
                            <img src="${imageUrl}" alt="profile-picture" class="w-full h-full object-cover">
                        </div>
                    </div>
                `).insertBefore($("#popup-add-gallery"))
                const form_update = document.getElementById("form-add-gallery");
                let formData = new FormData(form_update)
                $.ajax({
                    url: `/api/v1/recruiter/${RECRUITER_ID}/gallery`,
                    type: "POST",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    encrypt: "multipart/form-data",
                    success: (response) => {
                        if(response.status_code == 200){
                            console.log(response);
                        }
                    },
                    error: function (request, status, error) {
                        alert("Error!")
                    },
                });
                $("form-add-gallery").submit()
            }
        })
    })
})

function updateSeekerData(formId, URL, method){
    const form_update = document.getElementById(formId);
    $(`#${formId}`).submit(function(e){
        e.preventDefault();
        let formData = new FormData(form_update)
        $.ajax({
            url: URL,
            type: method,
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            encrypt: "multipart/form-data",
            processData: false,
            success: (response) => {
                if(response.status_code == 200){
                    location.reload()
                }
            },
            error: function (request, status, error) {
                alert("Error!")
            },
        });
    })
}