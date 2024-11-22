'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Shirt, ArrowRight, Plus, X } from 'lucide-react'

const useMouseParallax = (strength: number = 0.1) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    x.set((mousePosition.x - window.innerWidth / 2) * strength)
    y.set((mousePosition.y - window.innerHeight / 2) * strength)
  }, [mousePosition, strength, x, y])

  return { x, y }
}

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; radius: number; color: string; velocity: { x: number; y: number } }[] = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5
        }
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        if (particle.x < 0 || particle.x > canvas.width) particle.velocity.x *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.velocity.y *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })
    }

    animate()

    return () => cancelAnimationFrame(animate as unknown as number)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

const RainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const raindrops: { x: number; y: number; length: number; speed: number }[] = []

    for (let i = 0; i < 100; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 5 + 5
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)'
      ctx.lineWidth = 1

      raindrops.forEach(drop => {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed
        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })
    }

    animate()

    return () => cancelAnimationFrame(animate as unknown as number)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

const MouseTrail = () => {
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])
  const trailLength = 20

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { x: e.clientX, y: e.clientY }]
        if (newTrail.length > trailLength) {
          newTrail.shift()
        }
        return newTrail
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {trail.map((point, index) => (
        <motion.div
          key={index}
          className="absolute w-4 h-4 rounded-full bg-white pointer-events-none"
          style={{
            left: point.x,
            top: point.y,
            opacity: 1 - index / trailLength,
            scale: 1 - index / trailLength,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1 - index / trailLength, scale: 1 - index / trailLength }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </>
  )
}

const LightTransition = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-blue-100 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-300 to-white mix-blend-overlay" />
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 20, rotate: 180 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white rounded-full opacity-30 blur-3xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const EnhancedFashionPlatform = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outfit, setOutfit] = useState<{ image: string, description: string } | null>(null)
  const [wardrobe, setWardrobe] = useState<{ image: string, description: string }[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'wardrobe'>('generate')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null)
  const rainSoundRef = useRef<HTMLAudioElement>(null)

  const { x, y } = useMouseParallax()

  useEffect(() => {
    setIsLoaded(true)
    if (rainSoundRef.current) {
      rainSoundRef.current.play()
    }
    return () => {
      if (rainSoundRef.current) {
        rainSoundRef.current.pause()
        rainSoundRef.current.currentTime = 0
      }
    }
  }, [])

  const handleEnter = () => {
    setShowTransition(true)
    setTimeout(() => {
      setShowInput(true)
      setShowTransition(false)
      if (rainSoundRef.current) {
        rainSoundRef.current.pause()
        rainSoundRef.current.currentTime = 0
      }
    }, 1500)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const generateOutfit = async () => {
    if (!selectedFile) {
      setError("请选择一张图片");
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageBytes = e.target?.result as string;
      const base64Image = imageBytes.split(',')[1];

      const data = {
        gender: (document.getElementById('gender') as HTMLSelectElement)?.value || 'male',
        occasion: (document.getElementById('occasion') as HTMLSelectElement)?.value || 'casual',
        birthday: (document.getElementById('birthday') as HTMLInputElement)?.value || '1990-01-01',
        style: "modern",
        image: base64Image
      };

      try {
        const response = await fetch('/generate_image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          const newOutfit = {
            image: imageUrl,
            description: "AI生成的穿搭方案"
          };
          setOutfit(newOutfit);
          setWardrobe(prev => [...prev, newOutfit]);
        } else {
          setError("生成图像失败，请重试");
        }
      } catch (error) {
        console.error("Error generating image:", error);
        setError("发生错误，请重试");
      } finally {
        setIsLoading(false);
      }

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    };
    reader.readAsDataURL(selectedFile);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      <audio 
        ref={rainSoundRef} 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E4%B8%8B%E9%9B%A8%E5%A3%B0-%E6%B7%85%E6%B2%A5%E6%B7%85%E6%B2%A5-%E8%87%AA%E7%84%B6%E7%8E%AF%E5%A2%83(Sound%20of%20Rain%20_5_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com-5HbnIddmnSFDLYDyIc7SavGRw9nnc6.mp3" 
        loop 
      />
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STYLY-LLQX4u1hA1PgVXow8WJbM71t0DyXtW.png"
          alt="Styly Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent mix-blend-overlay" />
      </div>

      {/* Particles Effect */}
      <Particles />

      {/* Rain Effect */}
      <RainEffect />

      {/* Mouse Trail Effect */}
      <MouseTrail />

      {/* Light Transition Effect */}
      <LightTransition isVisible={showTransition} />

      {/* Animated Content */}
      <AnimatePresence>
        {!showInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2 mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">AI Fashion</h1>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-8 text-center"
            >
              STYLY
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="max-w-2xl text-center text-lg md:text-xl text-gray-200 leading-relaxed mb-8"
            >
              "Styly" is a journey, a quest to unveil the attire that resonates with the rhythm of your heart.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isLoaded ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="w-full max-w-md h-1 mb-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <Button
                onClick={handleEnter}
                className="bg-white text-blue-800 hover:bg-blue-100 transition-colors duration-300"
              >
                Enter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Interface */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex h-screen bg-gradient-to-br from-blue-300 via-blue-100 to-white"
          >
            {/* Menu Button */}
            <motion.div
              className="fixed left-4 bottom-4 z-50"
              initial={false}
              animate={isMenuOpen ? { rotate: 45 } : { rotate: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={toggleMenu}
                className="w-12 h-12 rounded-full bg-black text-white hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md transform hover:scale-105 active:scale-95"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </Button>
            </motion.div>

            {/* Left Side Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed left-0 bottom-20 z-40 bg-white/10 backdrop-blur-md p-6 rounded-r-lg shadow-lg"
                >
                  <div className="flex flex-col space-y-4">
                    <Button
                      onClick={() => {
                        setActiveTab('generate')
                        setIsMenuOpen(false)
                      }}
                      className={`flex items-center space-x-2 w-full justify-start ${
                        activeTab === 'generate' ? 'bg-blue-500 text-white' : 'bg-white/20 text-blue-800 hover:bg-white/30'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>生成穿搭</span>
                    </Button>
                    <Button
                      onClick={() => {
                        setActiveTab('wardrobe')
                        setIsMenuOpen(false)
                      }}
                      className={`flex items-center space-x-2 w-full justify-start ${
                        activeTab === 'wardrobe' ? 'bg-blue-500 text-white' : 'bg-white/20 text-blue-800 hover:bg-white/30'
                      }`}
                    >
                      <Shirt className="w-5 h-5" />
                      <span>智能衣柜</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'generate' && (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="w-full bg-white/50 backdrop-blur-md text-blue-800 shadow-xl">
                      <CardHeader>
                        <CardTitle>AI时尚穿搭助手</CardTitle>
                        <CardDescription className="text-blue-600">上传你的单品照片，我们会为你生成完美穿搭</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="picture" className="text-blue-700">上传单品照片</Label>
                              <Input id="picture" type="file" onChange={handleFileChange} className="bg-white/50 text-blue-800" />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="occasion" className="text-blue-700">场合</Label>
                              <Select>
                                <SelectTrigger id="occasion" className="bg-white/50 text-blue-800">
                                  <SelectValue placeholder="选择场合" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="casual">日常休闲</SelectItem>
                                  <SelectItem value="work">工作场合</SelectItem>
                                  <SelectItem value="party">派对聚会</SelectItem>
                                  <SelectItem value="date">约会</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="birthday" className="text-blue-700">生日</Label>
                              <Input type="date" id="birthday" placeholder="选择你的生日" className="bg-white/50 text-blue-800" />
                            </div>
                            {/* Updated Gender Selection */}
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="gender" className="text-blue-700">性别</Label>
                              <Select>
                                <SelectTrigger id="gender" className="bg-white/50 text-blue-800">
                                  <SelectValue placeholder="选择性别" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">男性</SelectItem>
                                  <SelectItem value="female">女性</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={generateOutfit} 
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <span className="mr-2">生成中...</span>
                                  <span className="animate-spin">⏳</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-2 h-4 w-4" /> 生成穿搭方案
                                </>
                              )}
                            </Button>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                          </div>
                          {outfit && (
                            <Card className="w-full bg-white/30 backdrop-blur-md">
                              <CardHeader>
                                <CardTitle className="text-blue-800">你的专属穿搭方案</CardTitle>
                              </CardHeader>
                              <CardContent className="flex flex-col items-center">
                                <Image
                                  src={outfit.image}
                                  alt="AI生成的穿搭方案"
                                  width={300}
                                  height={400}
                                  className="rounded-lg shadow-lg mb-4"
                                />
                                <p className="text-center text-sm text-blue-700">{outfit.description}</p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                {activeTab === 'wardrobe' && (
                  <motion.div
                    key="wardrobe"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="w-full bg-white/50 backdrop-blur-md text-blue-800 shadow-xl">
                      <CardHeader>
                        <CardTitle>智能衣柜</CardTitle>
                        <CardDescription className="text-blue-600">查看和管理你的衣物和穿搭方案</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {wardrobe.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card className="bg-white/30 backdrop-blur-md hover:bg-white/40 transition-colors duration-300">
                                <CardContent className="p-4">
                                  <Image
                                    src={item.image}
                                    alt={`穿搭方案 ${index + 1}`}
                                    width={150}
                                    height={200}
                                    className="rounded-lg shadow-md mb-2 mx-auto"
                                  />
                                  <p className="text-center text-sm text-blue-700">{item.description}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Elements */}
      <audio ref={audioRef} src="/path-to-your-sound-effect.mp3" />
    </div>
  )
}

export default EnhancedFashionPlatform;