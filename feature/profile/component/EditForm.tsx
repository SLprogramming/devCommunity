"use client"
import React, { use, useEffect } from 'react'
import Image from 'next/image'
import { Briefcase, Camera, FileText, LinkIcon, MapPin, Plus, Save, User, X } from 'lucide-react'
import {type UserProfile } from '../queries'
import SelectTagsInput from './SelectTagsInput'
import { updateProfile } from '../actions'
const EditForm = ({userPromise}: { userPromise: Promise<UserProfile>}) => {
    const user = use(userPromise)
    const [formData,setFormData] = React.useState({
        name:user?.name || "",
        jobTitle:user?.profile?.jobTitle || "",
        address:user?.profile?.address || "",
        githubLink:user?.profile?.githubLink || "",
        bio:user?.profile?.bio || "",
        techStack:user?.profile?.techStack || [],
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

   useEffect(() => {
  if (user) {
    setFormData({
      name: user.name || "",
      jobTitle: user.profile?.jobTitle || "",
      address: user.profile?.address || "",
      githubLink: user.profile?.githubLink || "",
      bio: user.profile?.bio || "",
      techStack: user.profile?.techStack || [],
    });
  }
}, [user]);

    const handleSubmit = async () => {
        if(user?.id){
            let payload = {...formData,techStack:formData.techStack.map(tag => tag.id),id:user?.id }

            let res =await updateProfile(payload)
            console.log("update profile response",res)
        }
        
    }


  return (
         <div className="space-y-6">
        
        {/* Main Settings Card */}
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 space-y-8 relative overflow-hidden">
          
          {/* Decorative Back Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Avatar Placement Group */}
          <div className="flex items-center gap-5 relative">
            <div className="relative group cursor-pointer">
              <Image
                width={96}
                height={96}
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="User Profile Avatar"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-md group-hover:opacity-90 transition-opacity bg-muted"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Profile Picture</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Click the image avatar to upload a custom asset file. Max size 2MB.
              </p>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Input Grid Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input - Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full text-sm bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Input - Job */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Job Title
              </label>
              <input
                type="text"
                name='jobTitle'
                value={formData?.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Frontend Developer"
                className="w-full text-sm bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Input - Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Location
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., Yangon, Myanmar"
                className="w-full text-sm bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Input - GitHub */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" /> GitHub Link
              </label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                className="w-full text-sm bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Input - Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> About Me / Bio
            </label>
            <textarea
              rows={4}
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell other developers about yourself, your framework focus, or current goals..."
              className="w-full text-sm bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none leading-relaxed"
            />
          </div>

          <hr className="border-border/50" />

         <SelectTagsInput onTagsChange={(tags) => setFormData({...formData, techStack: tags})} selectedTags={formData?.techStack} />

        </div>

        {/* Footer Actions Panel Container */}
        <div className="flex items-center justify-end gap-3">
          <button className="text-xs font-semibold bg-transparent border border-border hover:bg-muted text-muted-foreground hover:text-foreground px-5 py-2.5 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors">
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>

      </div>
  )
}

export default EditForm
