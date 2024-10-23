/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UPDATE_PROFILE } from "@/graphql/mutations/UpdateProfile";
import { UPDATE_GOOGLE_PROFILE } from "@/graphql/mutations/UpdateGoogleProfile";
import { useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/stores/userStore";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    fullname: string;
    bio?: string;
    image?: string;
    googleImage?: string;
    googleId?: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [fullname, setFullname] = useState(user.fullname);
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState<File | null>(null);
  const [googleImage, setGoogleImage] = useState<File | null>(null);

  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [updateGoogleProfile] = useMutation(UPDATE_GOOGLE_PROFILE);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setFullname(user.fullname);
    setBio(user.bio || "");
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (user.googleId) {
        setGoogleImage(e.target.files[0]);
      } else {
        setImage(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (user.googleId) {
        const { data } = await updateGoogleProfile({
          variables: {
            fullname,
            bio,
            googleImage: googleImage,
          },
        });
        console.log("Google profile update response:", data);
        if (data && data.updateGoogleProfile) {
          setUser({
            ...user,
            id: data.updateGoogleProfile.id,
            fullname: data.updateGoogleProfile.fullname,
            bio: data.updateGoogleProfile.bio,
            googleImage: data.updateGoogleProfile.googleImage,
          });
          toast.success("Google profile updated successfully");
          onClose();
        } else {
          throw new Error("Failed to update Google profile");
        }
      } else {
        const { data } = await updateProfile({
          variables: {
            fullname,
            bio,
            image: image,
          },
        });
        console.log("Profile update response:", data);
        if (data && data.updateProfile) {
          setUser({
            ...user,
            id: data.updateProfile.id,
            fullname: data.updateProfile.fullname,
            bio: data.updateProfile.bio,
            image: data.updateProfile.image,
          });
          toast.success("Profile updated successfully");
          onClose();
        } else {
          throw new Error("Failed to update profile");
        }
      }
    } catch (error: any) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="pl-2 pt-1"
            />
          </div>
          <div>
            <Label htmlFor="profileImage">
              {user.googleId ? "Google Profile Image" : "Profile Image"}
            </Label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
