import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Video {
    id: string;
    title: string;
    createdAt: bigint;
    description: string;
    blobHash: string;
    videoUrl: string;
}
export interface AdminData {
    id: string;
    password: string;
}
export interface Testimonial {
    id: string;
    content: string;
    createdAt: bigint;
    role: string;
    author: string;
    rating: bigint;
}
export interface backendInterface {
    addTestimonial(adminData: AdminData, author: string, role: string, content: string, rating: bigint): Promise<string>;
    addVideo(adminData: AdminData, title: string, description: string, blobHash: string): Promise<string>;
    addVideoByUrl(adminData: AdminData, title: string, description: string, videoUrl: string): Promise<string>;
    deleteTestimonial(adminData: AdminData, id: string): Promise<void>;
    deleteVideo(adminData: AdminData, id: string): Promise<void>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getVideos(): Promise<Array<Video>>;
}
